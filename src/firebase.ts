import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDalkQPzs1eNfj7UPDGlExkqy-5-HuPfmI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cosmicbone-dca84.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://cosmicbone-dca84-default-rtdb.firebaseio.com/",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cosmicbone-dca84",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cosmicbone-dca84.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "186846177665",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:186846177665:web:69e9ed8ef441be9a9fa080",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-VHY9N47MJN"
};

const app = initializeApp(firebaseConfig);

let analytics = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.warn("Analytics failed:", e);
  }
}

export { analytics };
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export default app;
