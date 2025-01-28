// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEkTPycgLFBfwSuunohzCEm2rhGLb0VdU",
  authDomain: "library-e1811.firebaseapp.com",
  projectId: "library-e1811",
  storageBucket: "library-e1811.firebasestorage.app",
  messagingSenderId: "599543526671",
  appId: "1:599543526671:web:cd75e62612f297cfc5ba7a",
  measurementId: "G-DK5JWGPNDJ"
};  


// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize other Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
