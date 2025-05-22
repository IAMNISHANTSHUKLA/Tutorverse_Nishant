
// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp, type FirebaseOptions, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
// Add other Firebase services like Firestore if needed:
// import { getFirestore } from "firebase/firestore";

// User-provided Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBTPD7aUSndK-kdM383lPcpPYLxMlZ2xuo",
  authDomain: "tutorverse-n7dwu.firebaseapp.com",
  projectId: "tutorverse-n7dwu",
  storageBucket: "tutorverse-n7dwu.appspot.com", // Standard format, ensure this matches your project
  messagingSenderId: "824886474980",
  appId: "1:824886474980:web:c0567c4341244486f394f1"
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleAuthProvider: GoogleAuthProvider | null = null;

try {
  if (!firebaseConfig.apiKey) {
    console.error("CRITICAL_ERROR: Firebase API Key is missing in the hardcoded firebaseConfig. Authentication will not work.");
  } else {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    auth = getAuth(app);
    googleAuthProvider = new GoogleAuthProvider();
    console.log("Firebase initialized successfully with hardcoded config.");
  }
} catch (error) {
  console.error("CRITICAL_ERROR: Failed to initialize Firebase with the provided hardcoded configuration:", error);
  // app, auth, and googleAuthProvider will remain null if an error occurs.
  // This allows the app to load but auth features will be disabled.
}

// If you need Firestore:
// const db = app ? getFirestore(app) : null; // Example for Firestore

export { app, auth, googleAuthProvider /*, db */ };
