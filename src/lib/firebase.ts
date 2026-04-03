import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
};

console.log("Firebase Init Config:", {
  apiKey: firebaseConfig.apiKey ? "DEFINED" : "UNDEFINED",
  projectId: firebaseConfig.projectId ? "DEFINED" : "UNDEFINED"
});

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Force long-polling to bypass aggressive Ad-Blockers/VPNs that block WebSockets on localhost
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export { app, auth, db };
