// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyByAW6OWRpKeZkzjv2ZbZjXxF-SlMSbyGA",
    authDomain: "vue-firebase-8938c.firebaseapp.com",
    projectId: "vue-firebase-8938c",
    storageBucket: "vue-firebase-8938c.firebasestorage.app",
    messagingSenderId: "589662909436",
    appId: "1:589662909436:web:7f273a3fc8c5fd9c5d7879"
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();

const db = getFirestore(firebase);

export { auth, googleProvider, db };

