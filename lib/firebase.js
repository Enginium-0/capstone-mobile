// /lib/firebase.js

import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import {
    initializeAuth,
    getReactNativePersistence,
    GoogleAuthProvider,
    getAuth
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// 🔐 Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: Constants.expoConfig.extra.FIREBASE_API_KEY,
    authDomain: Constants.expoConfig.extra.FIREBASE_AUTH_DOMAIN,
    projectId: Constants.expoConfig.extra.FIREBASE_PROJECT_ID,
    storageBucket: Constants.expoConfig.extra.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: Constants.expoConfig.extra.FIREBASE_MESSAGING_SENDER_ID,
    appId: Constants.expoConfig.extra.FIREBASE_APP_ID,
    measurementId: Constants.expoConfig.extra.FIREBASE_MEASUREMENT_ID,
    databaseURL: Constants.expoConfig.extra.FIREBASE_DATABASE_URL,
};

// ✅ Initialize Firebase app once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// ✅ Auth with persistence for React Native
let auth;
try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
} catch (e) {
    auth = getAuth(app); // fallback for already-initialized
}

// 🔗 Firebase services
const db = getDatabase(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// ✅ Export for use
export { app, db, storage, auth, provider };
