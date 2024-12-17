import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKGDxQ83Ro3tcUr5J4uXJlrp7Ot3ljOVg",
  authDomain: "colorit3d.firebaseapp.com",
  projectId: "colorit3d",
  storageBucket: "colorit3d.firebasestorage.app",
  messagingSenderId: "961614248813",
  appId: "1:961614248813:web:cc88b2975ee46ca791f864",
  measurementId: "G-7JBC8FHSDY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);