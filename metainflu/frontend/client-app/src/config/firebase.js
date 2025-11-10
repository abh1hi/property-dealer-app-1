// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectStorageEmulator } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, 'asia-south1');

// Connect to emulators in development
if (import.meta.env.DEV || import.meta.env.VITE_USE_EMULATORS === 'true') {
  console.log('🔧 Connecting to Firebase Emulators...');
  
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    connectFunctionsEmulator(functions, 'localhost', 5001);
    
    console.log('✅ Connected to Firebase Emulators');
    console.log('   - Auth: http://localhost:9099');
    console.log('   - Firestore: http://localhost:8080');
    console.log('   - Storage: http://localhost:9199');
    console.log('   - Functions: http://localhost:5001');
  } catch (error) {
    console.warn('⚠️ Failed to connect to emulators:', error.message);
  }
}

export default app;
