import {
  createUserWithEmailAndPassword,
  signInWithRedirect,
  GoogleAuthProvider,
  onAuthStateChanged,
  Unsubscribe,
  signOut as firebaseAuthSignOut,
  User as FirebaseAuthUser,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "~/lib/firebase/client";

type AuthError = {
  code: string;
  message: string;
};

export const isAuthError = (e: unknown): e is AuthError => {
  return e instanceof Error && "code" in e && "message" in e;
};

// サインアップ系
export const CREATE_ACCOUNT_WITH_EMAIL_AND_PASSWORD_ERROR_CODE = {
  EMAIL_EXISTS: "auth/email-already-in-use",
  INVALID_EMAIL: "auth/invalid-email",
  INVALID_PASSWORD: "auth/wrong-password",
  POPUP_BLOCKED: "auth/popup-blocked",
  USER_DELETED: "auth/user-not-found",
  USER_DISABLED: "auth/user-disabled",
  USER_MISMATCH: "auth/user-mismatch",
  WEAK_PASSWORD: "auth/weak-password",
} as const;

export const createAccountWithEmailAndPassword = async (
  email: string,
  password: string
) => createUserWithEmailAndPassword(auth, email, password);

// メールサインイン
const signinWithEmailAndPasswordErrorCodes = [
  "auth/invalid-email",
  "auth/user-disabled",
  "auth/user-not-found",
  "auth/wrong-password",
] as const;
export type SigninWithEmailAndPasswordErrorCode =
  typeof signinWithEmailAndPasswordErrorCodes[number];
type SigninWithEmailAndPasswordError = {
  code: SigninWithEmailAndPasswordErrorCode;
  message: string;
};
export const isSigninWithEmailAndPasswordError = (
  e: unknown
): e is SigninWithEmailAndPasswordError => {
  return (
    e instanceof Error &&
    "code" in e &&
    "message" in e &&
    signinWithEmailAndPasswordErrorCodes.includes(e["code"])
  );
};
/**
 * @see https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithemailandpassword
 */
export const signinWithEmailAndPassword = (email: string, password: string) => {
  return firebaseSignInWithEmailAndPassword(auth, email, password);
};

// Googleサインイン
/**
 * @see https://firebase.google.com/docs/auth/web/google-signin
 * @see https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithredirect
 */
export const signInWithGoogle = async () => {
  const googleProvider = new GoogleAuthProvider();
  return signInWithRedirect(auth, googleProvider);
  // This gives you a Google Access Token. You can use it to access Google APIs.
  // const credential = GoogleAuthProvider.credentialFromResult(result);
  // const token = credential.accessToken;
};

export const signOut = () => firebaseAuthSignOut(auth);

export type AuthStateChangeHandler = (user: FirebaseAuthUser | null) => void;

export const subscribeAuthStateChanged = (
  handler: AuthStateChangeHandler,
  error?: (error: Error) => void,
  complete?: () => void
): Unsubscribe =>
  onAuthStateChanged(
    auth,
    (user) => {
      handler(user);
    },
    error,
    complete
  );

export type AuthTokenChangeHandler = (authToken: string | null) => void;
