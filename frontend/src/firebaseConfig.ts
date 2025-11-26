// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzd7BNMgBGy1jJqD0RErY-DeNlUZPEo3g",
  authDomain: "pomoai-8286d.firebaseapp.com",
  projectId: "pomoai-8286d",
  storageBucket: "pomoai-8286d.firebasestorage.app",
  messagingSenderId: "1093003856808",
  appId: "1:1093003856808:web:53d1c61ae58823343eeb9d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {database, auth, provider}