// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAA1WrAcjvokL4q6f208RLIwqzhxXoSS3g",
  authDomain: "metainflu.firebaseapp.com",
  projectId: "metainflu",
  storageBucket: "metainflu.appspot.com",
  messagingSenderId: "1083446985532",
  appId: "1:1083446985532:web:9852239d1b6b5f4749f7a7",
  measurementId: "G-1W5L3PJMPE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);


// --- Connection Settings ---

// To use the LIVE Firebase backend, comment out the entire 'if' block below.
// To use the LOCAL emulators, keep the block uncommented.

if (window.location.hostname === 'localhost') {
  console.log('Connecting to Firebase Emulators');

  // Point to the emulators
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, 'localhost', 8080);
  
  // Disable reCAPTCHA for testing with emulators.
  // This MUST be inside the emulator block and will crash the app if used with the live server.
  if (auth.settings) {
    auth.settings.appVerificationDisabledForTesting = true;
  }
}

export { auth, db };
