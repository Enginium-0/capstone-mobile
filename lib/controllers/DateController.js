// lib/controllers/DateController.js

import { get, child, ref } from "firebase/database";
import { db } from "../firebase";
import { getReservationRequests } from "./ReservationController";
import { STATUS } from "../utils/enums";

// Helper to pad numbers to 'HH'
const pad = (n) => String(n).padStart(2, '0')

// Convert 24h to AM/PM
const formatHour12 = (h) => {
  const hour = h % 12 === 0 ? 12 : h % 12;
  const suffix = h < 12 ? "AM" : "PM";
  return `${pad(hour)} ${suffix}`;
};

const getAvailableTimes = (blockedHours) => {
    const availableTimes = new Set();
    for (let i = 0; i < 24; i++) {
        if (!blockedHours.has(i)) {
            availableTimes.add(i);
        }
    }
    return Array.from(availableTimes).map(h => ({ h, name: formatHour12(h) }));
};

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;
const TEN_DAYS = 10 * ONE_DAY;

// string
const nextHour = (date) => {
    return new Date(new Date(date).getTime() + ONE_HOUR).toISOString();
}
// string
const nextDay = (date) => {
    return new Date(new Date(date).getTime() + ONE_DAY).toISOString().split("T")[0];
}

// I have to watch out for reservations that span multiple days
export async function getIngressTimes({ location, venue, ingressDate } = {}) {
    
    const reservations = await getReservationRequests();
    const targetReservations = reservations.filter( r => 
        // same location and venue
        r.location === location && r.venue === venue &&
        // another events on the past 10 days
        (new Date(ingressDate).getTime() - TEN_DAYS) <= new Date(r.ingressDate) &&
        (new Date(r.ingressDate) <= new Date(ingressDate)) &&
        // not completed or cancelled
        r.status < STATUS.COMPLETED
    )

    const blockedHours = new Set();
    // Block hours around each reservation with an allowance of 1 hour after egress and 2 hours before ingress
    for (const reservation of targetReservations) {
        let dayCounter = reservation.ingressDate; // string
        let hourCounter = new Date(new Date(reservation.ingressDate + 'T' + reservation.ingressTime + ':00').getTime() - 2 * ONE_HOUR).toISOString();
        const maxHour = nextHour(reservation.egressDate + 'T' + reservation.egressTime + ':00');
        while (dayCounter <= ingressDate) {
            while (hourCounter <= maxHour) {
                if (dayCounter.toISOString() === ingressDate.toISOString()) {
                    blockedHours.add(new Date(hourCounter).getHours());
                }
                hourCounter = nextHour(hourCounter);
            };
            dayCounter = nextDay(dayCounter);
        }
    }
    return getAvailableTimes(blockedHours);
}

export async function getEgressTimes({ location, venue, ingressDate, ingressTime, egressDate }) {

    const reservations = await getReservationRequests();
    const targetReservations = reservations.filter( r => 
        // same location and venue
        r.location === location && r.venue === venue &&
        // another events on the nezt 10 days after ingress
        (new Date(ingressDate).getTime() + TEN_DAYS) >= new Date(r.ingressDate) &&
        (new Date(r.ingressDate).toISOString() >= new Date(ingressDate)).toISOString() &&
        // not completed or cancelled
        r.status < STATUS.COMPLETED
    );

    const blockedHours = new Set();
    // Block hours around each reservation with an allowance of 1 hour after egress and 2 hours before ingress
    for (const reservation of targetReservations) {
        let dayCounter = reservation.ingressDate; // string
        let hourCounter = new Date(new Date(reservation.ingressDate + 'T' + reservation.ingressTime + ':00').getTime() - 2 * ONE_HOUR).toISOString();
        const maxHour = nextHour(nextDay(egressDate)); 
        while (dayCounter.toISOString() <= egressDate.toISOString()) {
            while (hourCounter.toISOString() < maxHour.toISOString()) {
                if (dayCounter.toISOString() === egressDate.toISOString()) {
                    blockedHours.add(new Date(hourCounter).getHours());
                }
                hourCounter = nextHour(hourCounter);
            };
            dayCounter = nextDay(dayCounter);
        }
    }
    
    //
    console.log("vianica");
    for (let i = parseInt(ingressTime); i >= 0 && egressDate.toISOString() === ingressDate.toISOString(); i--) {
        console.log("ingressTime:", i);
        blockedHours.add(i);
    }

    // console.log(getAvailableTimes(blockedHours));
    return getAvailableTimes(blockedHours);
}
