import {
  createUserWithEmailAndPassword,
  signInWithRedirect,
  GoogleAuthProvider,
  onAuthStateChanged,
  Unsubscribe,
  signOut as firebaseAuthSignOut,
  onIdTokenChanged,
} from "firebase/auth";
import { User } from "@/types";
import { convertFirebaseAuthUserToUser } from "@/utils/user";
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

export const signOut = () => firebaseAuthSignOut(auth);

export type AuthStateChangeHandler = (user: User | null) => void;

export const subscribeAuthStateChanged = (
  handler: AuthStateChangeHandler,
  error?: (error: Error) => void,
  complete?: () => void
): Unsubscribe =>
  onAuthStateChanged(
    auth,
    (firebaseAuthUser) => {
      const user =
        firebaseAuthUser && convertFirebaseAuthUserToUser(firebaseAuthUser);
      handler(user);
    },
    error,
    complete
  );

export type AuthTokenChangeHandler = (authToken: string | null) => void;

export const subscribeAuthTokenChanged = (
  handler: AuthTokenChangeHandler,
  error?: (error: Error) => void,
  complete?: () => void
) =>
  onIdTokenChanged(
    auth,
    async (firebaseAuthUser) => {
      const authToken =
        firebaseAuthUser && (await firebaseAuthUser.getIdToken());
      handler(authToken);
    },
    error,
    complete
  );
