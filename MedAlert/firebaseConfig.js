import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { API_KEY } from "@env";

import "firebase/auth";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "medalert-386812.firebaseapp.com",
  databaseURL: "https://medalert-386812-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "medalert-386812",
  storageBucket: "medalert-386812.appspot.com",
  messagingSenderId: "435459398641",
  appId: "1:435459398641:web:c640e32a44f0e4cb598250",
  measurementId: "G-ZL35VZP8EM",
};

export const api_key = API_KEY;
export const app = initializeApp(firebaseConfig);
export const firestorage = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
