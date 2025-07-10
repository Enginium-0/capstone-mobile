// dev/seed-services.js
import { getLocations } from '../lib/controllers/LocationController.js';
import { getVenues } from '../lib/controllers/VenueController.js';
import { generateId } from '../lib/utils/table.js';
import { set, ref, child, update } from 'firebase/database';
import { db } from '../lib/firebase.js';

export default async function seedServices() {
  const user = { uid: 'testruns' };

  const locations = await getLocations({ hideDefault: true });
  if (!locations.length) {
    console.error("❌ No locations found.");
    return;
  }
  const location = locations[0];

  const venues = await getVenues({ byLocation: location.code });
  if (!venues.length) {
    console.error("❌ No venues found for selected location.");
    return;
  }
  const venue = venues[0];

  const entries = [
    { status: 0, dispatched: null },
    { status: 1, dispatched: 'user_001' },
    { status: 2, dispatched: 'user_001' },
  ];

  for (const entry of entries) {
    const id = await generateId(db, 'job_orders');
    const conversation = await generateId(db, 'conversations');

    const job_order = {
      id,
      requestor: user.uid,
      location: location.code,
      venue: venue.code,
      nature: 3,
      problem: `Seeded service with status ${entry.status}`,
      item: null,
      image: null, // No image uploaded in seeder
      status: 0, // Always initialized at 0
      departments: ['Facilities_Office'],
      conversation,
      created: Date.now(),
    };

    await set(child(ref(db), `job_orders/${id}`), job_order);

    console.log(`✅ Seeded job order: ${id} with status ${entry.status}`);
  }
}
