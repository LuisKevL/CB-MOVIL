import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfigg = {
  apiKey: "AIzaSyB_lHJTfmB1_nQY31kM6YoJLyUUlEKjtLU",
  authDomain: "estadiasnew.firebaseapp.com",
  projectId: "estadiasnew",
  storageBucket: "estadiasnew.appspot.com",
  messagingSenderId: "278370932654",
  appId: "1:278370932654:web:6577447f965e69cec81a3f"
};


// Initialize Firebase
const app = initializeApp(firebaseConfigg);
export const storage = getStorage(app);