// seed/seed-requests.js

import { db } from '../lib/firebase.js';
import {
  ref,
  child,
  set,
} from 'firebase/database';

const accounts = [
  {
    uid: '12345678',
    name: 'Juan Dela Cruz',
    department: 'Facilities_Office',
    email: 'jndelacruz@feudiliman.edu.ph',
  },
  {
    uid: '24681012',
    name: 'Maria Leonora Teresa',
    department: 'Clean_Master',
    email: 'mlteresa@feudiliman.edu.ph',
  },
  {
    uid: '36912151',
    name: 'Cardo Dalisay',
    department: 'Facilities_Office',
    email: 'cadalisay@feudiliman.edu.ph',
  },
  {
    uid: '12812012',
    name: 'Kashmir Palma',
    department: 'Facilities_Office',
    email: 'jkpbecaro@gmail.com',
  },
];

export default async function seedRequests() {
  try {
    for (const account of accounts) {
      const reqRef = child(ref(db), `requests/${account.uid}`);
      await set(reqRef, account);
      console.log(`✅ Seeded request for ${account.name}`);
    }
    console.log('🎉 All requests have been seeded.');
  } catch (error) {
    console.error('❌ Failed to seed requests:', error);
  }
}

// Run immediately if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedRequests();
}
