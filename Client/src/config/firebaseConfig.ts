// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cultureconnect-18c55.firebaseapp.com",
  projectId: "cultureconnect-18c55",
  storageBucket: "cultureconnect-18c55.firebasestorage.app",
  messagingSenderId: "74008425454",
  appId: "1:74008425454:web:957259f368377ee6ef54ff",
  measurementId: "G-HYM27EB5R0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// provider.setCustomParameters({
//   prompt:"select_account"
// })

export {auth,provider};