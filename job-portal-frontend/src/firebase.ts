// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC23xc6HLlrI97sjL625mNLYA13o9-uoVs",
  authDomain: "job-portal-95328.firebaseapp.com",
  projectId: "job-portal-95328",
  storageBucket: "job-portal-95328.firebasestorage.app",
  messagingSenderId: "644359989572",
  appId: "1:644359989572:web:fd44f991c032494a660f11",
  measurementId: "G-YC9SWGHFQ8"
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});
export const storage = getStorage(app);