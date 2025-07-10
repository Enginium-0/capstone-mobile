// dev/seed-announcement.js

import { postAnnouncement } from '../lib/controllers/AnnouncementController.js';

const announcement = {
  title: 'Unite! Team Building',
  message: 'Join us for an unforgettable team building experience this weekend!',
  admin: 'testrun',
  image: 'https://static.vecteezy.com/system/resources/thumbnails/003/250/897/small_2x/team-building-concept-with-big-word-text-and-puzzle-with-team-people-free-vector.jpg',
};

export default async function seedAnnouncements(db) {
  await postAnnouncement(announcement)
    .then(announcement => console.log(`✅ Seeded announcement: ${announcement.title} (${announcement.id})`))
    .catch(err => console.error('❌ Failed to seed announcement:', err));
}

