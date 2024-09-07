import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsGvmPP4TpWAUzjyWCrSXB-z5a010iXL4",
  authDomain: "koshakeep.firebaseapp.com",
  projectId: "koshakeep",
  storageBucket: "koshakeep.appspot.com",
  messagingSenderId: "117348835133",
  appId: "1:117348835133:web:29244621cd0955e6e66f54",
  measurementId: "G-GS7ZL2B2T7"
};

const app = initializeApp(firebaseConfig);
const fireDb = getFirestore(app);

export { fireDb, app };