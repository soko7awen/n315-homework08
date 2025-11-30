import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQLeb2Lxccm1ESSJpo_cEX-gkiJ1Goy0k",
  authDomain: "n315-hhamelin.firebaseapp.com",
  projectId: "n315-hhamelin",
  storageBucket: "n315-hhamelin.firebasestorage.app",
  messagingSenderId: "298641233135",
  appId: "1:298641233135:web:c4b75bacfc96ec889bf71a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
