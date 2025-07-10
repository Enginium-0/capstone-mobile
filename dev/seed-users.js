// dev/seed-users.js

import { postUser } from '../lib/controllers/UserController.js';

const users = [
  { uid: 'testruns', name: 'Test Runs', department: 'Facilities_Office', email: 'jkpbecaro@gmail.com' },
//   { uid: 'sadsadawdawdawd', name: 'Jovan Kashmir Becaro', department: 'Facilities_Office', email: '202210345@feudiliman.edu.ph' },
//   { uid: '12mase123iaw131', name: 'Drix Paulo Molina', department: 'Maintenance_Office', email: '202210401@feudiliman.edu.ph' },
//   { uid: '1nisan19f20se141', name: 'Rea Vianica Sampaga', department: 'Clean_Master', email: '202210181@feudiliman.edu.ph' },
//   { uid: 'mppsperm141udw04', name: 'Joshua Pangilinan', department: 'Registrar_Office', email: '202210392@feudiliman.edu.ph' },
//   { uid: 'pqwebzsdqnq2ya19', name: 'Toney Quitiquit', department: 'Information_Technology_Services_Office', email: '202210348@feudiliman.edu.ph' },
];

export default async function seedUsers() {
  try {
    for (const user of users) {
      await postUser(user);
    }
  } catch (err) {
    console.error('⚠️ Seeding users failed:', err);
  }
}

seedUsers();