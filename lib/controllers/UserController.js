// lib/controllers/UserController.js

import { ref, get, child } from "firebase/database";
import { db, auth } from "../firebase.js";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

export async function getUser(uid) {
  try {
    const snapshot = await get(child(ref(db), `users/${uid}`));
    const data = snapshot.exists() ? snapshot.val() : { name: `No user ${uid}` };
    return data;
  } catch (err) {
    console.error("❌ Failed to get user by UID:", err);
    throw err;
  }
}

export async function loginWithGoogle(accessToken) {
  try {
    const credential = GoogleAuthProvider.credential(null, accessToken);
    const result = await signInWithCredential(auth, credential);
    return result.user;
  } catch (err) {
    console.error("Google Sign-In Error", err);
    throw err;
  }
}
