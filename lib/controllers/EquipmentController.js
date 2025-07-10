// lib/controllers/EquipmentController.js

import { ref, set, get, child } from 'firebase/database';
import { db } from '../firebase.js';
import { generateId } from '../utils/table.js';
import { getGroupByCode } from './GroupController.js';

// Fetch equipment objects by array of IDs
export async function getEquipments({ byIds = null, byVenue = null, byHidden = null } = {}) {
  const snapshot = await get(child(ref(db), 'equipments'));
  const data = Object.values(snapshot.val() ?? {});
  
  let filtered = data;

  // Filter by array of IDs
  if (Array.isArray(byIds)) {
    const idSet = new Set(byIds);
    filtered = filtered.filter(eq => idSet.has(eq.id));
  }

  if (byVenue) {
    filtered = filtered.filter(eq => eq.station === byVenue && eq.group);
  }

  if (byHidden !== null) {
    filtered = filtered.filter(eq => Number(eq.hidden) == byHidden);
  }

  return filtered;
}

// Fetch equipment by ID
export async function getEquipmentById(id) {
  const snapshot = await get(child(ref(db), `equipments/${id}`));
  return snapshot.exists() ? snapshot.val() : null;
}

// Post a new equipment
export async function postEquipment({ reference, name, group, department, station, hidden = false }) {
  const id = await generateId(db, 'equipments');
  const groupObj = await getGroupByCode(group);
  const equipment = {
    reference,
    id,
    name: groupObj.name + " " + name,
    group,
    department,
    hidden,
    station,
  };

  await set(child(ref(db), `equipments/${id}`), equipment);
  return equipment;
}
