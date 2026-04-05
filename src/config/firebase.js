import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBp3QQTbT31rc42Zyazj9VqrPjCtLvsfg8",
  authDomain: "ideal-class.firebaseapp.com",
  projectId: "ideal-class",
  storageBucket: "ideal-class.firebasestorage.app",
  messagingSenderId: "479905824627",
  appId: "1:479905824627:web:fcc4dbd7a31372a5fe8f06",
  measurementId: "G-04C2ZSQPF9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
