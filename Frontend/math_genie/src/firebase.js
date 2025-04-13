// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAYEOEKw7TRR7SCqmiw1hDI7saUm7gmAVA",
    authDomain: "mathgenie-70ad4.firebaseapp.com",
    projectId: "mathgenie-70ad4",
    storageBucket: "mathgenie-70ad4.firebasestorage.app",
    messagingSenderId: "321100898696",
    appId: "1:321100898696:web:80609282ff8fcf0678da3d"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
