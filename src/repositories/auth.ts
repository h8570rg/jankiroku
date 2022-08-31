import {
  createUserWithEmailAndPassword,
  signInWithRedirect,
  GoogleAuthProvider,
  onAuthStateChanged,
  Unsubscribe,
  signOut as firebaseAuthSignOut,
  User as FirebaseAuthUser,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signInAnonymously,
  AuthErrorCodes,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "~/lib/firebase/client";
export { AuthErrorCodes } from "firebase/auth";

const AUTH_ERROR_DETAIL: {
  [key: string]: {
    cause: "email" | "password" | "other";
    message: string;
  };
} = {
  [AuthErrorCodes.EMAIL_EXISTS]: {
    cause: "email",
    message: "このメールアドレスは使用されています",
  },
  [AuthErrorCodes.INVALID_EMAIL]: {
    cause: "email",
    message: "メールアドレスの形式が正しくありません",
  },
  [AuthErrorCodes.INVALID_PASSWORD]: {
    cause: "password",
    message: "パスワードが間違っています",
  },
  [AuthErrorCodes.USER_DELETED]: {
    cause: "email",
    message: "ユーザーが見つかりませんでした",
  },
  [AuthErrorCodes.USER_DISABLED]: {
    cause: "email",
    message: "サービスの利用が停止されています",
  },
  [AuthErrorCodes.USER_MISMATCH]: {
    cause: "other",
    message: "メールアドレスまたはパスワードが違います",
  },
  [AuthErrorCodes.WEAK_PASSWORD]: {
    cause: "password",
    message: "パスワードが弱すぎます",
  },
} as const;

type AuthError = {
  code: string;
  message: string;
};

const isAuthError = (e: unknown): e is AuthError => {
  return (
    e instanceof Error &&
    "code" in e &&
    "message" in e &&
    e["code"] in AUTH_ERROR_DETAIL
  );
};

export const getErrorDetail = (e: unknown) => {
  if (isAuthError(e) && AUTH_ERROR_DETAIL[e.code]) {
    return AUTH_ERROR_DETAIL[e.code];
  } else {
    throw e;
  }
};

// サインアップ系

export const createAccountWithEmailAndPassword = async (
  email: string,
  password: string
) => createUserWithEmailAndPassword(auth, email, password);

export const signinWithEmailAndPassword = (email: string, password: string) => {
  return firebaseSignInWithEmailAndPassword(auth, email, password);
};

export const signinWithGoogle = async () => {
  const googleProvider = new GoogleAuthProvider();
  return signInWithRedirect(auth, googleProvider);
  // This gives you a Google Access Token. You can use it to access Google APIs.
  // const credential = GoogleAuthProvider.credentialFromResult(result);
  // const token = credential.accessToken;
};

export const signinAnonymously = () => signInAnonymously(auth);

export const signOut = () => firebaseAuthSignOut(auth);

export const subscribeAuthStateChanged = (
  handler: (user: FirebaseAuthUser | null) => void,
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

export const sendPasswordResetEmail = (email: string) =>
  firebaseSendPasswordResetEmail(auth, email);
