// lib/controllers/GroupController.js

import { ref, set, get, child } from 'firebase/database';
import { user } from "../../dev/temp.js";
import { db } from '../firebase.js';

// Fetch all groups
export async function getGroups({ byEquipments = null } = {}) {
  const snapshot = await get(child(ref(db), 'groups'));
  const data = snapshot.val() ?? {};

  if (byEquipments) {
    const equipmentGroups = new Set(byEquipments.map(eq => eq.group));
    return Object.entries(data)
      .filter(([code]) => equipmentGroups.has(code))
      .map(([_, group]) => group);
  }

  return Object.values(data);
}

// Fetch a group by code
export async function getGroupByCode(code) {
  const snapshot = await get(child(ref(db), `groups/${code}`));
  return snapshot.exists() ? snapshot.val() : null;
}

// Post a new group
export async function postGroup({ code, name, collective = false }) {
    const group = {
        code,
        name,
        category: (collective) ? 'collective' : 'referenced',
        created: Date.now(),
        admin: user.uid,
        quantity: 0,
    };
  await set(child(ref(db), `groups/${code}`), group);
  return group;
}
