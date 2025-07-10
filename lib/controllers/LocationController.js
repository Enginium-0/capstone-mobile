// lib/controllers/LocationController.js

import { ref, get, child, set } from 'firebase/database';
import { db } from '../firebase.js';
import { generateId } from '../utils/table.js';

export async function getLocation(id) {
  const snapshot = await get(child(ref(db), `locations/${id}`));
  return snapshot.val() ?? {};
}

// Fetch all locations; optionally filter out 'default'
export async function getLocations({hideDefault = false} = {}) {
  const snapshot = await get(child(ref(db), 'locations'));
  const data = Object.values(snapshot.val() ?? {});

  if (!hideDefault) return data;

  return data.filter( loc => loc.name !== 'default');
}

// Post a new location
export async function postLocation({ name, department, hidden = false, admin = '--------' }) {
  const id = await generateId(db, 'locations');
  const location = {
    code: id,
    name,
    department,
    hidden,
    created: Date.now(),
    admin,
  };

  await set(child(ref(db), `locations/${id}`), location);
  return location;
}