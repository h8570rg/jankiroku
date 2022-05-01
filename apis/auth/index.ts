import { auth, getDoc, setDoc } from "@/firebase/clientApp";
import { FIRESTORE } from "@/constants";
import {
  createUserWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";
import { provider as googleProvider } from "./googleProvider";
import { User } from "types";

export const createAccountWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
};

/**
 * @see https://firebase.google.com/docs/auth/web/google-signin
 */
export const signInWithGoogle = async () => {
  try {
    await signInWithRedirect(auth, googleProvider);
    // This gives you a Google Access Token. You can use it to access Google APIs.
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential.accessToken;
  } catch (error) {
    throw error;
  }
};

export const fetchUser = async (uid: string) =>
  getDoc<User>(FIRESTORE.COLLECTION.USERS, uid);

export const createUser = async (user: User) =>
  setDoc<User>(user, FIRESTORE.COLLECTION.USERS, user.uid);
