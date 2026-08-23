import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAPlqfkjH85GR5w3YrYb9xGUMREdmCP1Qg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "app-atelier-defd9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "app-atelier-defd9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "app-atelier-defd9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "878541475060",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:878541475060:web:808e6bedc2cafd32e4e2a1",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-6TKCHM61D7"
};

export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
