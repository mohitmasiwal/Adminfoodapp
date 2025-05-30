 // src/firebase.js or src/firebase/Firebase.jsx

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore"; // if you're also using Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCbsKcUhNbRvI9HJx0vkVqDhR2ZwUFVBqk",
  authDomain: "restorant-e82e0.firebaseapp.com",
  projectId: "restorant-e82e0",
  storageBucket: "restorant-e82e0.appspot.com", // ✅ fixed
  messagingSenderId: "749904062765",
  appId: "1:749904062765:web:03d9b3d54c47192b154ba4",
  measurementId: "G-TVRT4BK4X1"
};

const app = initializeApp(firebaseConfig);

// ✅ Export Firebase services
export const auth = getAuth(app);
export const db = getDatabase(app); // for Realtime Database
export const firestore = getFirestore(app); // optional if using Firestore
