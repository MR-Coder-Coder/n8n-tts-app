// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyCDyGqtmelXD-fVX47LSpAshM96SjBN4Og",
    authDomain: "n8n-tts-app.firebaseapp.com",
    projectId: "n8n-tts-app",
    storageBucket: "n8n-tts-app.appspot.com",
    messagingSenderId: "157704806188",
    appId: "1:157704806188:web:839c863ff13a9973631689",
    measurementId: "G-5Q53BLS659"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { app, auth, db };