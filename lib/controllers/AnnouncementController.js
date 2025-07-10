// lib/controllers/AnnouncementController.js

import { ref, set, get } from 'firebase/database';
import { db } from '../firebase.js';
import { generateId } from '../utils/table.js';

// Post a new announcement
export async function postAnnouncement({ title, message, admin, image }) {
  try {
    const id = await generateId(db, 'announcements');
    const created = Date.now();

    const data = { id, title, message, admin, image, created };
    const announcementRef = ref(db, `${'announcements'}/${id}`);
    await set(announcementRef, data);

    return data;
  } catch (err) {
    console.error('❌ Failed to post announcement:', err);
  }
}

// Get the latest announcement by timestamp
export async function getLatestAnnouncement() {
  try {
    const snapshot = await get(ref(db, 'announcements'));
    const all = snapshot.val() ?? {};
    const sorted = Object.values(all).sort((a, b) => b.created - a.created);

    return sorted[0] ?? null;
  } catch (err) {
    console.error('❌ Failed to get latest announcement:', err);
    throw err;
  }
}
