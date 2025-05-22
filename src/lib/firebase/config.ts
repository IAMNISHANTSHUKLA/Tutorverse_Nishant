
// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp, type FirebaseOptions, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
// Add other Firebase services like Firestore if needed:
// import { getFirestore } from "firebase/firestore";

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleAuthProvider: GoogleAuthProvider | null = null;

if (!apiKey) {
  console.error(
    "CRITICAL_ERROR: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing or undefined. " +
    "Please ensure this environment variable is set correctly in your Firebase Studio project settings (or .env.local for local development). " +
    "After setting it, you MUST restart/redeploy your application for the change to take effect. " +
    "Firebase initialization is skipped, and authentication will NOT work."
  );
} else {
  const firebaseConfig: FirebaseOptions = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
  };

  if (!authDomain) {
    console.warn(
      "Firebase Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) is missing. This might cause issues with authentication."
    );
  }
  if (!projectId) {
    console.warn(
      "Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is missing. This might cause issues with Firebase services."
    );
  }

  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    auth = getAuth(app);
    googleAuthProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error("Error initializing Firebase app or Auth services:", error);
    // Set to null if any part of the initialization fails even if API key was present
    app = null;
    auth = null;
    googleAuthProvider = null;
  }
}

// If you need Firestore:
// const db = app ? getFirestore(app) : null; // Example for Firestore

export { app, auth, googleAuthProvider /*, db */ };
