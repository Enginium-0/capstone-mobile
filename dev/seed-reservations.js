// scripts/seed-reservations.js

import { getEquipments } from '../lib/controllers/EquipmentController.js';
import { getLocations } from '../lib/controllers/LocationController.js';
import { getVenues } from '../lib/controllers/VenueController.js';
import { ref, set } from 'firebase/database';
import { generateId } from '../lib/utils/table.js';
import { user } from '../dev/temp.js';

function toDateString(offset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
}

export default async function seedReservations(db) {
    const locations = await getLocations({hideDefault: true});
    const location = locations[0].code;

    if (!locations.length) {
        console.error("❌ Missing seed data: make sure locations is populated first.");
        return;
    }

    const venues = await getVenues({byLocation: location.code});
    const venue = venues[0].code;

    if (!venues.length) {
        console.error("❌ Missing seed data: make sure venues is populated first.");
        return;
    }

    const equipments = await getEquipments({ byHidden: false });

    if (!equipments.length) {
        console.error("❌ Missing seed data: make sure equipments is populated first.");
        return;
    }

    const equipmentId = equipments[0].id;

  const common = {
    name: "Seeded Reservation",
    requestor: user.uid,
    affiliation: "Internal",
    location,
    venue,
    ingressDate: toDateString(7),
    ingressTime: "08",
    egressDate: toDateString(7),
    egressTime: "10",
    equipments: [equipmentId],
    departments: ["Facilities_Office", "Registrar_Office"],
    document: 'https://google.com',
    image: 'https://google.com',
    guard: true,
    crew: false,
    rating: null,
    created: Date.now(),
  };

  for (let status = 0; status <= 2; status++) {
    const id = await generateId(db, 'reservations');
    const conversation = await generateId(db, 'conversations');

    const reservation = {
      ...common,
      id,
      status,
      conversation,
    };

    if (status > 0) {
        reservation.signatories = { Facilities_Office: 'testruns', Registrar_Office: 'testruns' };
        reservation.decisions = { Facilities_Office: 1, Registrar_Office: 1 };
    }

    await set(ref(db, `reservations/${id}`), reservation);
    console.log(`✅ Seeded reservation with status ${status}`);
  }
}

