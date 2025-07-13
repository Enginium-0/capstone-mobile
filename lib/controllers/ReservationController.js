// lib/controllers/ReservationController.js

import { db } from "@/lib/firebase";
import { generateId } from "@/lib/utils/table.js";
import { auth } from "@/lib/firebase";
import { getEquipments } from "@/lib/controllers/EquipmentController.js";
import { getVenue } from "@/lib/controllers/VenueController.js";
import { child, ref, set, get, update } from "firebase/database";
import { uploadFileAsync } from "@/lib/utils/form.js";

export async function postReservationRequest({ request = {} }) {
    console.log("📤 Starting postReservationRequest with:", request);

    const id = await generateId(db, 'reservations');
    console.log("🆔 Generated reservation ID:", id);

    let equipments = [];
    let departments = new Set();

    try {
        console.log("🔍 Looking up equipment items...");
        for (const item of request.equipments || []) {
            const equipment = await getEquipments({ id: item.id });
            if (equipment) {
                equipments.push({
                    id: equipment.id,
                    name: equipment.name,
                    description: item.description,
                    quantity: item.quantity,
                });
                departments.add(equipment.department);
            }
        }
        console.log("✅ Equipment lookup complete:", equipments);
    } catch (error) {
        console.error("❌ Failed to lookup equipments:", error);
    }

    let documentUrl = null;
    let floorPlanUrl = null;

    try {
        if (request.doc?.uri) {
            console.log("📄 Uploading document...");
            documentUrl = await uploadFileAsync(request.doc, `reservation-document-${id}`, 'auto');
            console.log("✅ Document uploaded:", documentUrl);
        }

        if (request.fp?.uri) {
            console.log("🗺 Uploading floor plan...");
            floorPlanUrl = await uploadFileAsync(request.fp, `reservation-floorplan-${id}`, 'image');
            console.log("✅ Floor plan uploaded:", floorPlanUrl);
        }
    } catch (error) {
        console.error("❌ Failed to upload file(s) to Cloudinary:", error);
    }

    try {
        const conversation = await generateId(db, 'conversations');
        console.log("💬 Generated conversation ID:", conversation);

        // Get current authenticated user
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error("❗ User not authenticated!");
        }

        const reservation = {
            id,
            name: request.name,
            requestor: currentUser.uid,
            affiliation: request.affiliation,
            location: request.location,
            venue: request.venue,
            ingressDate: request.ingressDate,
            ingressTime: request.ingressTime,
            egressDate: request.egressDate,
            egressTime: request.egressTime,
            equipments: request.equipments,
            departments: Array.from(departments),
            document: documentUrl,
            image: floorPlanUrl,
            guard: request.guard,
            crew: request.crew,
            status: 0,
            rating: null,
            conversation,
            created: Date.now(),
        };

        if (!reservation.requestor) throw new Error("❗ requestor UID is missing!");

        console.log("📦 Final reservation payload:", reservation);

        await set(ref(db, `reservations/${id}`), reservation);
        console.log("✅ Reservation saved to Firebase.");

        return id;
    } catch (err) {
        console.error("❌ Failed to save reservation in database:", err);
        return '';
    }
}


// // lib/controllers/ReservationController.js

// import { db } from "../firebase";
// import { generateId } from "../utils/table.js";
// import { user } from "../../dev/temp";
// import { getEquipments } from "./EquipmentController.js";
// import { getVenue  } from "./VenueController.js";
// import { child, ref, set, get, update } from "firebase/database";
// import { uploadFileAsync } from "../utils/form.js";
// // import { postConversation } from './ConversationController.js';

// export async function postReservationRequest({ request = {} }) {
//     const equipments = await getEquipments({ byIds: request.equipments });
//     const departments = new Set(equipments.map(eq => eq?.department).filter(Boolean));
//     departments.add('Facilities_Office');
//     const id = await generateId(db, 'reservations');

//     let documentUrl = null;
//     let floorPlanUrl = null;

//     try {
//         if (request.ap?.uri) {
//             documentUrl = await uploadFileAsync(request.ap, `reservation-${id}`, 'raw');
//         }
//         if (request.fp?.uri) {
//             floorPlanUrl = await uploadFileAsync(request.fp, `reservation-floorplan-${id}`, 'image');
//         }
//     } catch (error) {
//         console.error("❌ Failed to upload file to Cloudinary:", error);
//     }

//     try {
//         const conversation = await generateId(db, 'conversations');
//         const reservation = {
//             id,
//             name: request.name,
//             requestor: user.uid,
//             affiliation: request.affiliation,
//             location: request.location,
//             venue: request.venue,
//             ingressDate: request.ingressDate,
//             ingressTime: request.ingressTime,
//             egressDate: request.egressDate,
//             egressTime: request.egressTime,
//             equipments: request.equipments,
//             departments: Array.from(departments),
//             document: documentUrl,
//             image: floorPlanUrl,
//             guard: request.guard,
//             crew: request.crew,
//             status: 0,
//             rating: null,
//             conversation,
//             created: Date.now(),
//         };
//         await set(ref(db, `reservations/${id}`), reservation);
//         // await postConversation(conversation, user.uid,"Conversation created!")
//         return id;
//     } catch (err) {
//         console.error("❌ Failed to save reservation in database:", err);
//         return '';
//     }
// }

// Helper to convert date + hour into timestamp
const toTimestamp = (date, hour) => {
    const d = new Date(date);
    d.setHours(Number(hour), 0, 0, 0);
    return d.getTime();
};

export async function getReservationRequests({ uid = null, status = null, unrated = false } = {}) {
    const snapshot = await get(child(ref(db), 'reservations'));
    const data = snapshot.val() ?? {};

    return Object.values(data).filter((entry) =>
        (entry.requestor === uid || uid ==null) &&
        (status === null || entry.status === status) &&
        (!unrated || !entry.rating)
    );
}

export async function getAvailableEquipments({ ingressDate, ingressTime, egressDate, egressTime }) {
    const allSnapshot = await get(child(ref(db), "reservations"));
    const reservations = Object.values(allSnapshot.val() ?? {});

    const equipments = await getEquipments({ byHidden: false });

    const start = toTimestamp(ingressDate, ingressTime);
    const end = toTimestamp(egressDate, egressTime);

    // Remove reserved equipment from the list
    const reservedIds = new Set();
    reservations.forEach ( r => { 
        const rStart = toTimestamp(r.ingressDate, r.ingressTime);
        const rEnd = toTimestamp(r.egressDate, r.egressTime);
        const overlaps = !(rEnd < start || end < rStart);
        if (overlaps && Array.isArray(r.equipments)) {
        r.equipments.forEach(id => reservedIds.add(id));
        }
    });

    // Filter out reserved ones from original equipment list
    const availableEquipments = equipments.filter(eq => !reservedIds.has(eq.id));

    return availableEquipments;
}

// export async function getReservationRequest(id) {
//     try {
//         const snapshot = await get(child(ref(db), `reservations/${id}`));
//         return snapshot.val() ?? {};
//     } catch (err) {
//         console.log("yaw magpakuha amp!", err);
//         return {};
//     }
// }

// export async function updateReservation({ id, rating = null, status = null }) {
//   const updates = {};
//   if (rating !== null) updates.rating = rating;
//   if (status !== null) updates.status = status;
//   if (Object.keys(updates).length === 0) return;

//   const reqRef = ref(db, `reservations/${id}`);
//   await update(reqRef, updates);
// }


// export async function getLastReservation( uid ) {
//     const snapshot = await get(child(ref(db), 'reservations'));
//     const data = snapshot.val() ?? {};
//     const reservations = Object.values(data)
//         .filter(r => r.requestor === uid)
//         .sort((a, b) => b.created - a.created);
//     return reservations[0] ?? null;
// }
// export async function getVenueReservationStats({ uid }) {
//     if (!uid) throw new Error('UID is required');

//     // Fetch all reservations
//     const snapshot = await get(child(ref(db), 'reservations'));
//     const data = snapshot.val() ?? {};

//     // Filter reservations made by the given user
//     const userReservations = Object.values(data).filter(r => r.requestor === uid);

//     // Count occurrences per venue
//     const countByVenue = {};
//     userReservations.forEach(r => {
//         if (!r.venue) return;
//         countByVenue[r.venue] = (countByVenue[r.venue] || 0) + 1;
//     });

//     // Resolve venue names and return chart-compatible objects
//     const stats = await Promise.all(
//         Object.entries(countByVenue).map(async ([venueId, count]) => {
//         let venueData = {};
//         try {
//             venueData = await getVenue(venueId);
//         } catch (err) {
//             console.warn(`⚠️ Failed to get venue ${venueId}:`, err);
//         }

//         return {
//             name: venueData.name ?? venueId,
//             count,
//             color: getRandomColor(),
//             legendFontColor: "#333",
//             legendFontSize: 12,
//         };
//         })
//     );

//     return stats;
// }

// // Generates a random pastel-ish color
// function getRandomColor() {
//   return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
// }

