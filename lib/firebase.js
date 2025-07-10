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

// 🔐 Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCpxgt6ipq5Z7YNf6bjNINuzfvQvgYd2K0",
    authDomain: "enginiumfacilitease.firebaseapp.com",
    projectId: "enginiumfacilitease",
    storageBucket: "enginiumfacilitease.appspot.com",
    messagingSenderId: "729894555819",
    appId: "1:729894555819:web:db9ea8eb2356576fd1a7ee",
    measurementId: "G-L3JTT4ZYB0",
    databaseURL: "https://enginiumfacilitease-default-rtdb.asia-southeast1.firebasedatabase.app/",
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
