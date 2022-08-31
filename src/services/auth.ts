import { UserCredential } from "firebase/auth";
import router from "next/router";
import { authTokenCookie, refreshTokenCookie } from "~/lib/cookie";
import {
  createAccountWithEmailAndPassword,
  signinWithGoogle,
  signOut as _signOut,
  subscribeAuthStateChanged,
  signinWithEmailAndPassword,
  signinAnonymously,
  getErrorDetail,
  sendPasswordResetEmail as _sendPasswordResetEmail,
} from "~/repositories/auth";

export const METHOD = {
  GOOGLE: "google",
  EMAIL: "email",
} as const;
export type Method = typeof METHOD[keyof typeof METHOD];

export const signup = {
  email: async (email: string, password: string) => {
    try {
      const userCredential = await createAccountWithEmailAndPassword(
        email,
        password
      );
      return {
        success: true,
        userCredential,
      };
    } catch (e) {
      return {
        success: false,
        message: getErrorDetail(e).message,
      };
    }
  },
};

export const signin = {
  redirect: {
    google: signinWithGoogle,
  },
  email: async (
    email: string,
    password: string
  ): Promise<
    | { success: true; userCredential: UserCredential }
    | { success: false; cause: "email" | "password" | "other"; message: string } // TODO: ここの型定義
  > => {
    try {
      const userCredential = await signinWithEmailAndPassword(email, password);
      const authToken = await userCredential.user.getIdToken();
      authTokenCookie.client.set(authToken);
      return {
        success: true,
        userCredential,
      };
    } catch (e) {
      return {
        success: false,
        ...getErrorDetail(e),
      };
    }
  },
  anonymous: signinAnonymously,
};

export const signOut = () => {
  _signOut();
  authTokenCookie.client.destory();
  refreshTokenCookie.client.destory();
  router.push("/signin");
};

export const subscribeAuthTokenChange = (
  handler: (
    authToken: string | undefined,
    refreshToken: string | undefined
  ) => void
) => {
  return subscribeAuthStateChanged(async (user) => {
    const authToken = await user?.getIdToken();
    const refreshToken = user?.refreshToken;
    handler(authToken, refreshToken);
  });
};

export const sendPasswordResetEmail = async (
  email: string
): Promise<
  | { success: true }
  | { success: false; cause: "email" | "password" | "other"; message: string }
> => {
  try {
    await _sendPasswordResetEmail(email);
    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      ...getErrorDetail(e),
    };
  }
};
