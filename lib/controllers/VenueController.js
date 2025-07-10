// lib/controllers/VenueController.js

import { ref, set, get, child } from 'firebase/database';
import { db } from '../firebase.js';
import { generateId } from '../utils/table.js';

export async function getVenue(id) {
  const snapshot = await get(child(ref(db), `venues/${id}`));
  return snapshot.val() ?? {};
}

// Fetch all venues
export async function getVenues({byLocation = null} = {}) {
  const snapshot = await get(child(ref(db), 'venues'));
  const data = Object.values(snapshot.val() ?? {});
  if (!byLocation) return data;
  return data.filter(venue => venue.location === byLocation);
}

// Post a new venue
export async function postVenue({ name, department, location, hidden = false, admin = '--------', capacity = 0, }) {
    const id = await generateId(db, 'venues');
    const venue = {
        code: id,
        name,
        department,
        location,
        capacity,
        hidden,
        created: Date.now(),
        admin,
    };

    await set(child(ref(db), `venues/${id}`), venue);
    return venue;
}
