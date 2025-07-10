// dev/clean.js
import { ref, remove, get, child } from 'firebase/database';
import { db } from '../lib/firebase.js';

async function clearSeeds() {
  console.log('🪣🧼 Wiping realtime data...');

  try {
    const snapshot = await get(child(ref(db), '/'));
    const data = snapshot.val() ?? {};

    for (const table of Object.keys(data)) {
      const key = table;
      const tableRef = child(ref(db), table);
      const tableData = (await get(tableRef)).val();

      if (!tableData) {
        console.log(`🔍 No data found in ${table}`);
        continue;
      }

      await Promise.all(
        Object.keys(tableData).map((id) => remove(child(tableRef, id)))
      );

      console.log(`🧹  Cleared ${key}`);
    }

    console.log('🚽✨ All data flushed.');
  } catch (err) {
    console.error('🧻💩 Failed to clear:', err);
  } finally {
    process.exit(0);
  }
}

clearSeeds();
