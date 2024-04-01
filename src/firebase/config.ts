import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBFy3-8O6veV3PrUUxdEFHzU8ikZHzLs6k",
  authDomain: "note-taking-app-121f3.firebaseapp.com",
  projectId: "note-taking-app-121f3",
  storageBucket: "note-taking-app-121f3.appspot.com",
  messagingSenderId: "865212009930",
  appId: "1:865212009930:web:f17bd7294444378de61333",
  measurementId: "G-7RZZ33HEGK",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
