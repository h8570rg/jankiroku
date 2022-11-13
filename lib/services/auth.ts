import { UserCredential } from "firebase/auth";
import { config } from "~/lib/config";
import { authTokenCookie, refreshTokenCookie } from "~/lib/cookie";
import * as authRepo from "~/lib/repositories/auth";

export const METHOD = {
  GOOGLE: "google",
  EMAIL: "email",
} as const;
export type Method = typeof METHOD[keyof typeof METHOD];

export const signup = {
  email: async (
    email: string,
    password: string
  ): Promise<
    | { success: true; userCredential: UserCredential }
    | { success: false; cause: "email" | "password" | "other"; message: string }
  > => {
    try {
      const userCredential = await authRepo.createAccountWithEmailAndPassword(
        email,
        password
      );
      const authToken = await userCredential.user.getIdToken();
      authTokenCookie.client.set(authToken);
      return {
        success: true,
        userCredential,
      };
    } catch (e) {
      return {
        success: false,
        ...authRepo.getErrorDetail(e),
      };
    }
  },
};

export const signin = {
  redirect: {
    google: authRepo.signinWithGoogle,
  },
  email: async (
    email: string,
    password: string
  ): Promise<
    | { success: true; userCredential: UserCredential }
    | { success: false; cause: "email" | "password" | "other"; message: string }
  > => {
    try {
      const userCredential = await authRepo.signinWithEmailAndPassword(
        email,
        password
      );
      const authToken = await userCredential.user.getIdToken();
      authTokenCookie.client.set(authToken);
      return {
        success: true,
        userCredential,
      };
    } catch (e) {
      return {
        success: false,
        ...authRepo.getErrorDetail(e),
      };
    }
  },
  anonymous: authRepo.signinAnonymously,
};

export const signOut = async () => {
  await authRepo.signOut();
  authTokenCookie.client.destory();
  refreshTokenCookie.client.destory();
};

export const subscribeAuthStateChanged = authRepo.subscribeAuthStateChanged;

export const sendPasswordResetEmail = async (
  email: string
): Promise<
  | { success: true }
  | { success: false; cause: "email" | "password" | "other"; message: string }
> => {
  try {
    await authRepo.sendPasswordResetEmail(email);
    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      ...authRepo.getErrorDetail(e),
    };
  }
};

export const sendEmailVerification = () =>
  authRepo.sendEmailVerification({
    url: `${config.public.origin}/signup/email-verify/redirect`,
  });
