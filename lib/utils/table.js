// lib/utils/table.js
import { ref, get, child } from 'firebase/database';

// returns a unique ID for a given table
export async function generateId(db, table, length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  while (true) {
    // generates id based on length
    let id = '';
    for (let i = 0; i < length; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
    // checks if id is unique
    const snapshot = await get(child(ref(db), `${table}/${id}`));
    if (!snapshot.exists()) {
      return id;
    }
  }
}

// checks if a name exists in a given table
export async function nameExists(db, table, name) {
  const snapshot = await get(child(ref(db), table));
  const data = snapshot.val();

  // if table is empty or doesn't exist
  if (!data) return false;

  return Object.values(data).some(item => item.name === name);
}

// finds the ID of a record in a table by matching its name
export async function getIdByName(db, table, name) {
  const snapshot = await get(child(ref(db), table));
  const data = snapshot.val();

  if (!data) return null;

  const match = Object.entries(data).find(([_, entry]) => entry.name === name);
  return match ? match[0] : null;
}
