
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCKR16aBaIME0fKjS4Mr6LsurA5Y5ZS8Oc",
  authDomain: "app1-7ca56.firebaseapp.com",
  projectId: "app1-7ca57",
  storageBucket: "app1-7ca57.appspot.com",
  messagingSenderId: "457796889775",
  appId: "1:457793889775:web:f3bf8c2fb4b03263dd051a"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore();

const storage = getStorage(app);

export {auth,db, app, storage};
