import {
  createUserWithEmailAndPassword,
  signInWithRedirect,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "src/firebase/client";

export const createAccountWithEmailAndPassword = async (
  email: string,
  password: string
) => createUserWithEmailAndPassword(auth, email, password);

/**
 * @see https://firebase.google.com/docs/auth/web/google-signin
 */
export const signInWithGoogle = async () => {
  const googleProvider = new GoogleAuthProvider();
  return signInWithRedirect(auth, googleProvider);
  // This gives you a Google Access Token. You can use it to access Google APIs.
  // const credential = GoogleAuthProvider.credentialFromResult(result);
  // const token = credential.accessToken;
};
