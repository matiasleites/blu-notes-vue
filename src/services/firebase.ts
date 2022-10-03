import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_VUE_APP_APIKEY,
  authDomain: import.meta.env.VITE_VUE_APP_AUTHDOMAIN,
  databaseURL: import.meta.env.VITE_VUE_APP_DB,
  projectId: import.meta.env.VITE_VUE_APP_PID,
  storageBucket: import.meta.env.VITE_VUE_APP_SB,
  messagingSenderId: import.meta.env.VITE_VUE_APP_SID,
  appId: import.meta.env.VITE_VUE_APP_APPID,
  measurementId: import.meta.env.VITE_VUE_APP_MID,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore(app);
export { app, auth, firestore };
