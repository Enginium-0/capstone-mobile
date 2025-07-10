// dev/seed-venue.js
import { postLocation } from '../lib/controllers/LocationController.js';
import { postVenue } from '../lib/controllers/VenueController.js';
import { generateId } from '../lib/utils/table.js';

export default async function seedVenues(db) {
  const locations = [
    { name: 'default', department: 'Registrar_Office' },
    { name: 'New Building', department: 'Registrar_Office' },
    { name: 'Main Building', department: 'Facilities_Office'},
    { name: 'Open Court',  department: 'Facilities_Office'},
  ];

  for (const loc of locations) {
    loc.admin = 'testruns',
    loc.created = Date.now();
    loc.hidden = (loc.name === 'default');
    const location = await postLocation(loc);

    const venue = await postVenue({
      name: (loc.name === 'default') ? 'default' : 'Room 1',
      department: loc.department,
      location: location.code,
      hidden: loc.hidden,
      admin: loc.admin,
      capacity: 20,
    });
    
    console.log(`✅ Added location: ${location.name} (${location.code})`);
    console.log(`✅ Added venue: ${venue.name} (${venue.code})`);
  }
}
