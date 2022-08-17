import { UserCredential } from "firebase/auth";
import router from "next/router";
import { authTokenCookie } from "@/utils/cookie";
import {
  createAccountWithEmailAndPassword,
  signInWithGoogle,
  signOut as _signOut,
  subscribeAuthTokenChanged,
} from "~/repositories/auth";

export const METHOD = {
  GOOGLE: "google",
  EMAIL: "email",
} as const;
export type Method = typeof METHOD[keyof typeof METHOD];

export const signup = {
  email: async (email: string, password: string) => {
    try {
      const userCredential: UserCredential =
        await createAccountWithEmailAndPassword(email, password);
    } catch {
      throw new Error("aaaaaa");
    }
  },
};

export const signin: Record<Method, VoidFunction> = {
  google: async () => {
    try {
      await signInWithGoogle();
      router.push("/signin/redirect");
    } catch (error: any) {
      // TODO
      throw new Error(error);
    }
  },
  email: () => {
    // todo
  },
};

export const signOut = () => {
  _signOut();
  authTokenCookie.destory();
  router.push("/signin");
};

export const subscribeAuthTokenChangeAndRefresh = () => {
  return subscribeAuthTokenChanged((authToken) => {
    if (authToken) {
      authTokenCookie.set(authToken);
    } else {
      authTokenCookie.destory();
    }
  });
};
