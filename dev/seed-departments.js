// dev/seed-department.js
import { postDepartment, getDepartment } from '../lib/controllers/DepartmentController.js';

export default async function seedDepartments() {
  const DEPARTMENTS = {
      'Facilities_Office': 'Facilities Office',
      'Clean_Master': 'Clean Master',
      'Maintenance_Office': 'Maintenance Office',
      'Registrar_Office': 'Registrar Office',
      'IT_Services_Office': 'IT Services Office',
  }

  for (const [code, label] of Object.entries(DEPARTMENTS)) {
    const existing = await getDepartment(code);
    if (existing) {
      console.log(`⚠️ Department "${label}" already exists.`);
      continue;
    }

    const dept = await postDepartment(code, label);
    console.log(`✅ Added department: ${dept.name} (${dept.id})`);
  }
}