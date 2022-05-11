import {
  createUserWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";
import { FIRESTORE } from "@/constants";
import { auth, db } from "@/firebase/clientApp";
import { User } from "@/types";
import { provider as googleProvider } from "./googleProvider";

export const createAccountWithEmailAndPassword = async (
  email: string,
  password: string
) => createUserWithEmailAndPassword(auth, email, password);

/**
 * @see https://firebase.google.com/docs/auth/web/google-signin
 */
export const signInWithGoogle = async () => {
  return signInWithRedirect(auth, googleProvider);
  // This gives you a Google Access Token. You can use it to access Google APIs.
  // const credential = GoogleAuthProvider.credentialFromResult(result);
  // const token = credential.accessToken;
};

export const fetchUser = async (uid: string) =>
  db.getDoc<User>(FIRESTORE.COLLECTION.USERS, uid);

export const createUser = async (user: User) =>
  db.setDoc<User>(user, FIRESTORE.COLLECTION.USERS, user.uid);
