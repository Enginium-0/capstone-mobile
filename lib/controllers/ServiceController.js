// lib/controllers/ServiceController.js
import { ref, child, set, get, update } from 'firebase/database';
import { db } from '../firebase.js';
import { generateId } from '../utils/table.js';
import { uploadFileAsync } from '../utils/form.js'; 
import { postConversation } from './ConversationController.js';

// Posts the service request in the job_orders table
export async function postServiceRequest(form, user = {}) {
  console.log("Call of function 'postServiceRequest' successfully initiated...");
  try {
    const id = await generateId(db, 'job_orders');
    const conversation = await generateId(db, 'conversations');

    let imageUrl = null;

    if (form.image?.uri) {
      try {
        imageUrl = await uploadFileAsync(form.image, "service-" + id, 'image');
      } catch (uploadError) {
        console.error("❌ Image upload failed:", uploadError);
        return '';
      }
    } else {
      console.log("ℹ️ No image provided.");
    }

    const job_order = {
      id,
      requestor: user.uid,
      location: form.location,
      venue: form.venue,
      nature: form.nature,
      problem: form.problem,
      item: form.item ?? null,
      image: imageUrl,
      status: 0,
      departments: ['Facilities_Office'],
      conversation,
      created: Date.now(),
    };

    await set(child(ref(db), `job_orders/${id}`), job_order);
    await postConversation(conversation, user.uid,"Conversation created!")
    return id;
  } catch (error) {
    console.error("❌ Error posting service request:", error);
    return '';
  } 
}

export async function getServiceRequest(id) {
  const snapshot = await get(child(ref(db), `job_orders/${id}`));
  return snapshot.val() ?? {};
}

export async function getServiceRequests({ uid, status = null, unrated = false }) {
  if (!uid) throw new Error('UID is required');

  const snapshot = await get(child(ref(db), 'job_orders'));
  const data = snapshot.val() ?? {};

  return Object.values(data).filter((entry) =>
    entry.requestor === uid &&
    (status === null || entry.status === status) &&
    (!unrated || !entry.rating)
  );
}

export async function updateJobOrder({ id, rating = null }) {
  const updates = {};
  if (rating !== null) updates.rating = rating;
  if (Object.keys(updates).length === 0) return; // nothing to update

  const jobRef = ref(db, `job_orders/${id}`);
  await update(jobRef, updates);
}

export async function getLastServiceRequest({ uid }) {
  
  try {
    const snapshot = await get(child(ref(db), 'job_orders'));
    const data = snapshot.val() ?? {};

    const jobs = Object.values(data)
    .filter(j => j.requestor === uid)
    .sort((a, b) => b.created - a.created);

    return jobs[0] ?? null;
  } catch (err) {
    console.error("bad:", err);
  }
}
