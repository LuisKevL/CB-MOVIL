import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAXupjWKUt_LvWn0VofanwTG7GW5ixYXLM",
  authDomain: "estadias-87c3e.firebaseapp.com",
  projectId: "estadias-87c3e",
  storageBucket: "estadias-87c3e.appspot.com",
  messagingSenderId: "185799262840",
  appId: "1:185799262840:web:e9042a2aa4477b9b19238d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);