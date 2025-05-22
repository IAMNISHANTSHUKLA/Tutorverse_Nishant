
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
  storageBucket: "tutorverse-n7dwu.appspot.com", // Corrected common typo: .appspot.com
  messagingSenderId: "824886474980",
  appId: "1:824886474980:web:c0567c4341244486f394f1"
};

let app: FirebaseApp;
let auth: Auth;
let googleAuthProvider: GoogleAuthProvider;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  auth = getAuth(app);
  googleAuthProvider = new GoogleAuthProvider();
} catch (error) {
  console.error("CRITICAL_ERROR: Failed to initialize Firebase with the provided configuration:", error);
  // In a scenario where Firebase fails to initialize even with hardcoded values,
  // we might still want to set these to null or handle the error gracefully,
  // but for now, we'll assume initialization will succeed if config is valid.
  // This part might need more robust error handling if init still fails.
  throw new Error("Firebase initialization failed. Check the console for details.");
}

// If you need Firestore:
// const db = getFirestore(app); // Example for Firestore

export { app, auth, googleAuthProvider /*, db */ };
