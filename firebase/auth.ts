import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig";

// Sign Up
export const registerUser = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign In
export const loginUser = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};
