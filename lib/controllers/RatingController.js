// lib/controllers/RatingController.js
import { child, get, ref, set, update } from "firebase/database";
import { db } from "../firebase";

export async function rateVenue({venue, rating, recommendation}) {

    const venueRef = child(ref(db),`ratings/venues/${venue.code}`);
    const snapshot = await get(venueRef);

    try {
        rating = Number(rating);
        if (recommendation ?? false ) recommendation.trim();
        if (snapshot.exists()) {
            const data = Object.values(snapshot.val());
            console.log(data);
            const raters = data[0] + 1;
            const neo = {
                raters,
                rating: (data[0] * data[1] + rating)/(raters),
            }
            
            if ((data[2] === undefined) && (recommendation ?? false)) {
                neo.recommendations = [recommendation];
            }
            else if ((data[2] !== undefined) && (recommendation ?? false)) {
                data[2].push(recommendation);
                neo.recommendations = data[2];
            }
            update(venueRef, neo);
        } else {
            const neo = {
                name: venue.name,
                raters: 1,
                rating: rating,
            }
            neo.recommendations = (recommendation ?? false) ? [recommendation] : null;
            set(venueRef, neo);
        }
        return "rating";
    } catch (err) {
        console.error("langya, ayaw:", err);
        return "";
    }
}

// rates a personnel
export async function ratePersonnel({ employee, rating, recommendation }) {
  try {
    const personnelRef = ref(db, `ratings/personnel/${employee.department}/${employee.uid}`);
    const snapshot = await get(personnelRef);


    // CASE: user does not exist
    if (!snapshot.exists()) {
      const newData = {
        uid: employee.uid,
        name: employee.name ?? '',
        rater: 1,
        rating: rating,
      };
      if (recommendation?.trim()) {
        newData.recommendations = [recommendation];
      }
      await set(personnelRef, newData);
    } else {
        const currentData = snapshot.val() ?? {};
        const prevRecs = Array.isArray(currentData.recommendations) ? currentData.recommendations : [];
        const rater = currentData.rater + 1;
        
        rating = (currentData.rating * currentData.rater + Number(rating)) / rater;

      const updates = {
        rating,
        rater,
      };
      if (recommendation?.trim()) {
        updates.recommendations = [...prevRecs, recommendation];
      }

      const success = await update(personnelRef, updates);
    }
    return "rating";
  } catch (err) {
    console.error('❌ Failed to rate department personnel:', err);
    return "";
  }
}