import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Browser client (uses config from .env.local)
let browserApp: ReturnType<typeof initializeApp> | null = null;
let browserAuth: ReturnType<typeof getAuth> | null = null;
let browserFirestore: ReturnType<typeof getFirestore> | null = null;

export function getBrowserApp() {
  if (!browserApp) {
    browserApp = initializeApp(firebaseConfig);
  }
  return browserApp;
}

export function getBrowserAuth() {
  if (!browserAuth) {
    browserAuth = getAuth(getBrowserApp());
  }
  return browserAuth;
}

export function getBrowserFirestore() {
  if (!browserFirestore) {
    browserFirestore = getFirestore(getBrowserApp());
  }
  return browserFirestore;
}
