// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAS8phqV1SjtjsF7jZmxeZBg8cUbKdQVZA",
  authDomain: "apnaashiyanaa-app.firebaseapp.com",
  projectId: "apnaashiyanaa-app",
  storageBucket: "apnaashiyanaa-app.firebasestorage.app",
  messagingSenderId: "920496133974",
  appId: "1:920496133974:web:31ed935fab1f72d6d5a8f7",
  measurementId: "G-XEB52QYP1F"
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
