// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyBcNMljnGsYT3f7KXvVensE8z_qUSlt0iM",
  authDomain: "docs-1166e.firebaseapp.com",
  projectId: "docs-1166e",
  storageBucket: "docs-1166e.appspot.com",
  messagingSenderId: "1010429022739",
  appId: "1:1010429022739:web:646f81468ea22d761b65e6",
  measurementId: "G-VRW6WE8BFQ",
  storageBucket: 'gs://docs-1166e.appspot.com'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);