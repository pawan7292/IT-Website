import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB17BEw7lhKI_gGBt5cOFCWIJIm2T4y7Jo",
  authDomain: "digital-marmat.firebaseapp.com",
  projectId: "digital-marmat",
  storageBucket: "digital-marmat.firebasestorage.app",
  messagingSenderId: "665330112617",
  appId: "1:665330112617:web:ae872c541b949ab8b3aaf8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
