// dev/seed-equipments.js
import { generateId, getIdByName } from '../lib/utils/table.js';
import { postGroup } from '../lib/controllers/GroupController.js';
import { postEquipment } from '../lib/controllers/EquipmentController.js';

export default async function seedEquipments(db) {
  const department_id = 'Facilities_Office';

  const venue_id = await getIdByName(db, 'venues', 'default');
  if (!venue_id) {
    console.log('⚠️ default venue not found.');
    return;
  }

  const groups = [
    { name: 'Flags' },
    { name: 'Canon Projector' }
  ];

  for (const group of groups) {
    group.code = await generateId(db, 'groups');
    await postGroup({ ...group, collective: false });
    console.log(`✅ Group added: ${group.code} - ${group.name}`);
  }

  const equipments = [
    {
      reference: '12345678',
      name: 'Philippines',
      group: await getIdByName(db, 'groups', 'Flags'),
      department: department_id,
      hidden: false,
      station: venue_id,
    },
    {
      reference: '87654321',
      name: 'CP2200 9',
      group: await getIdByName(db, 'groups', 'Canon Projector'),
      department: department_id,
      hidden: false,
      station: venue_id,
    }
  ];

  for (const equipment of equipments) {
    await postEquipment(equipment);
    console.log(`✅ Equipment added: ${equipment.name} (${equipment.reference})`);
  }
}
