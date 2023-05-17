import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore, query, doc, getDoc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA630mEkGs-Zq9cMkIVWs9rfrLEZGOIKic",
  authDomain: "medalert-386812.firebaseapp.com",
  projectId: "medalert-386812",
  storageBucket: "medalert-386812.appspot.com",
  messagingSenderId: "435459398641",
  appId: "1:435459398641:web:c640e32a44f0e4cb598250",
  measurementId: "G-ZL35VZP8EM",
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
