// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6AIcj_gU_Zj1-k2F8KcmCfcAyWjTohlU",
  authDomain: "quizzh.firebaseapp.com",
  projectId: "quizzh",
  storageBucket: "quizzh.firebasestorage.app",
  messagingSenderId: "367391066101",
  appId: "1:367391066101:web:57c347974809b314e742bc",
  measurementId: "G-3FPYYP041L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider };
