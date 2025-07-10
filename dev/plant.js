// dev/plant.js
import { db } from '../lib/firebase.js';
import seedAnnouncements from './seed-announcements.js';
import seedDepartments from './seed-departments.js';
import seedVenues from './seed-venues.js';
import seedEquipments from './seed-equipments.js';
import seedUsers from './seed-users.js';
import seedServices from './seed-services.js';
import seedReservations from './seed-reservations.js';
import seedRequests from './seed-requests.js';

async function runSeeds() {
  console.log('👨‍🌾🌱 Starting seed...');

  try {
    console.log('🪴  Seeding departments...');
    await seedDepartments(db);
    console.log('🪴  Seeding venues...');
    await seedVenues(db);
    console.log('🪴  Seeding equipments...');
    await seedEquipments(db);
    console.log('🪴  Seeding users...');
    await seedUsers(db);
    // console.log('🪴  Seeding job orders...');
    // await seedServices(db);
    // console.log('🪴  Seeding reservations...');
    await seedReservations(db);
    console.log('🪴  Seeding announcements...');
    await seedAnnouncements(db);
    // console.log('🪴  Seeding account requests...');
    // await seedRequests();
    console.log('🥕🌽 All seeding complete.');
  } catch (err) {
    console.error('⛔🥀  Seeding failed:', err);
  } finally {
    process.exit(0);
  }
}

runSeeds();
