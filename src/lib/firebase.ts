import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBmHDM6D7l457aOmLgn7SXeLrlXUuhnT5o",
  authDomain: "gen-lang-client-0140024270.firebaseapp.com",
  projectId: "gen-lang-client-0140024270",
  storageBucket: "gen-lang-client-0140024270.firebasestorage.app",
  messagingSenderId: "385446229148",
  appId: "1:385446229148:web:f77cb8e8a5c0f5fbee2959"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the named database ID from config and enable long-polling
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, "ai-studio-volksgrond-b6d86398-cc59-4a63-9e78-93f700dc786e");

export { db, app };
