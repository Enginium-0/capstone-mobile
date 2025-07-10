// lib/controllers/DateController.js

import { get, child, ref } from "firebase/database";
import { db } from "../firebase";

// Helper to pad numbers to 'HH'
const pad = (n) => String(n).padStart(2, '0')

// Convert 24h to AM/PM
const formatHour12 = (h) => {
  const hour = h % 12 === 0 ? 12 : h % 12;
  const suffix = h < 12 ? "AM" : "PM";
  return `${pad(hour)} ${suffix}`;
};

export async function getIngressTimes({ location, venue, ingressDate } = {}) {
    

    const allSnapshot = await get(child(ref(db), "reservations"));
    const reservations = Object.values(allSnapshot.val() ?? {});

    const day = new Date(ingressDate).getDate();
    const blockedHours = new Set();

    // Filter relevant reservations
    
    ingressDate = ingressDate?.toISOString().split("T")[0];
    const targetReservations = reservations.filter(r => 
        r.location === location &&
        r.venue === venue &&
        (r.ingressDate === ingressDate || r.egressDate === ingressDate)
    );


    // Block hours around each reservation
    for (const r of targetReservations) {
        let inTime = Math.max(0, Number(r.ingressTime) - 2);
        let outTime = Math.min(23, Number(r.egressTime) + 1);


        let dStart = new Date(r.ingressDate).getDate();
        let dEnd = new Date(r.egressDate).getDate();

        for (let d = dStart, hour = inTime; hour != outTime && d <= dEnd; hour %= 24) {
            if (d === day) {
            blockedHours.add(pad(hour));
            }
            if (++hour == 24) {
                d++;
            }
        }
    }

  // Generate available hours
  const ingressTimes = [];
  for (let i = 0; i < 24; i++) {
    const h = pad(i);
    if (!blockedHours.has(h)) {
      ingressTimes.push([h, { name: formatHour12(i) }]);
    }
  }

  return ingressTimes;
}

export async function getEgressTimes({ location, venue, ingressDate, ingressTime, egressDate }) {
    console.log('getEgressTimes');
    console.log(location, venue, ingressDate, ingressTime, egressDate);
    const allSnapshot = await get(child(ref(db), "reservations"));
    const reservations = Object.values(allSnapshot.val() ?? {});

    ingressDate = ingressDate?.toISOString().split("T")[0];
    egressDate = egressDate?.toISOString().split("T")[0];

    const targetReservations = reservations.filter(r => {
        console.log("ingressDate:", r.ingressDate, egressDate);
        return(
            r.location === location &&
            r.venue === venue &&
            (r.ingressDate === ingressDate || r.ingressDate > ingressDate)
        )}
    );

    const egressTimes = [];
    const openHours = new Set();

    // Case 1: Same-day rollback
    if (ingressDate === egressDate) {
        console.log("same-day");
        const nextReservation = targetReservations.find(r =>
        r.ingressDate === egressDate && Number(r.ingressTime) > Number(ingressTime)
        );

        const endHour = nextReservation ? Number(nextReservation.ingressTime) : 24;

        for (let hour = Number(ingressTime) + 1; hour < endHour; hour++) {
        openHours.add(pad(hour));
        }
    }
    // Case 2: Multi-day reservation
    else {
        // Find the next reservation on or after egressDate
        let nextReservation = null;
        for (let i = 0; i < 10; i++) { // prevent infinite loop by limit to check 10 days from ingressDate
            const checkDate = new Date(ingressDate);
            checkDate.setDate(checkDate.getDate() + i);
            const checkDateStr = checkDate.toISOString().split("T")[0];

            nextReservation = targetReservations.find(r =>
                r.ingressDate === checkDateStr
            );

            if (nextReservation || checkDate > new Date(egressDate)) break;
        }
        // No next events or so far
        if (!nextReservation || egressDate < nextReservation.ingressDate) { 
            for (let h = 0; h < 24; h++) {
                openHours.add(pad(h));
            }
        } else {
            // next event ingress is in the same day of egress
            if (egressDate == nextReservation.ingressDate) {   
                for (let h = 0; h < Number(nextReservation.ingressTime); h++) {
                    openHours.add(pad(h));
                }
            }
        }
    }

    // Build egressTimes array from openHours
    openHours.forEach(hours => {
        console.log(hours);
    });
    for (let i = 0; i < 24; i++) {
        const h = pad(i);
        if (openHours.has(h)) {
            console.log(h);
            egressTimes.push([h, { name: formatHour12(i) }]);
        }
    }

    return egressTimes;
}
