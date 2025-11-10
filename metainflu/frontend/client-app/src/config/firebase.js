// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAA1WrAcjvokL4q6f208RLIwqzhxXoSS3g",
  authDomain: "test1-50da1.firebaseapp.com",
  projectId: "test1-50da1",
  storageBucket: "test1-50da1.firebasestorage.app",
  messagingSenderId: "317809189734",
  appId: "1:317809189734:web:4177473e2f9143010a5ea7",
  measurementId: "G-1K9VKFNNWM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);


// --- Connection Settings ---

// To use the LIVE Firebase backend, comment out the entire 'if' block below.
// To use the LOCAL emulators, keep the block uncommented.
if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}

export { auth, db };
