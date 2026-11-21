import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyADUt7gnJCegd9TxYx9nDjAJFVDJELhG_w",
  authDomain: "my-personal-portfolio-67505.firebaseapp.com",
  projectId: "my-personal-portfolio-67505",
  storageBucket: "my-personal-portfolio-67505.firebasestorage.app",
  messagingSenderId: "260918327513",
  appId: "1:260918327513:web:6736fb39f9af43c13366c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);