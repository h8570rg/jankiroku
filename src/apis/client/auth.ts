import {
  createUserWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/utils/firebase/client";

export const googleProvider = new GoogleAuthProvider();

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
