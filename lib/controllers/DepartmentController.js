// lib/controllers/DepartmentController.js
import { ref, get, child, set, update } from 'firebase/database';
import { db } from '../firebase.js';

import { getEquipments } from './EquipmentController.js';

// Fetch unique departments from a list of equipment IDs
export async function getDepartments({ byEquipments = [] } = {}) {
  const equipments = await getEquipments({ byIds: byEquipments });
  const departments = new Set();

  for (const eq of equipments) {
    if (eq?.department) {
      departments.add(eq.department);
    }
  }

  return Array.from(departments);
}


// Fetch a department by its key
export async function getDepartment(code) {
  const snapshot = await get(child(ref(db), `departments/${code}`));
  return snapshot.exists() ? snapshot.val() : null;
}

// Add a new department with code and display name
export async function postDepartment(code, name) {
  const department = { id: code, name };
  await set(child(ref(db), `departments/${code}`), department);
  return department;
}
