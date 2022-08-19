import router from "next/router";
import { authTokenCookie } from "@lib/cookie";
import {
  createAccountWithEmailAndPassword,
  signInWithGoogle,
  signOut as _signOut,
  subscribeAuthTokenChanged,
  isAuthError,
  CREATE_ACCOUNT_WITH_EMAIL_AND_PASSWORD_ERROR_CODE,
} from "~/repositories/auth";

const SIGNUP_EMAIL_ERROR_MESSAGE: { [key: string]: string } = {
  [CREATE_ACCOUNT_WITH_EMAIL_AND_PASSWORD_ERROR_CODE.EMAIL_EXISTS]:
    "このメールアドレスは使用されています",
  [CREATE_ACCOUNT_WITH_EMAIL_AND_PASSWORD_ERROR_CODE.INVALID_EMAIL]:
    "メールアドレスの形式が正しくありません",
  [CREATE_ACCOUNT_WITH_EMAIL_AND_PASSWORD_ERROR_CODE.INVALID_PASSWORD]:
    "メールアドレスまたはパスワードが違います",
  [CREATE_ACCOUNT_WITH_EMAIL_AND_PASSWORD_ERROR_CODE.POPUP_BLOCKED]:
    "認証ポップアップがブロックされました。ポップアップブロックをご利用の場合は設定を解除してください",
  [CREATE_ACCOUNT_WITH_EMAIL_AND_PASSWORD_ERROR_CODE.USER_DELETED]:
    "メールアドレスまたはパスワードが違います",
  [CREATE_ACCOUNT_WITH_EMAIL_AND_PASSWORD_ERROR_CODE.USER_DISABLED]:
    "サービスの利用が停止されています",
  [CREATE_ACCOUNT_WITH_EMAIL_AND_PASSWORD_ERROR_CODE.USER_MISMATCH]:
    "メールアドレスまたはパスワードが違います",
  [CREATE_ACCOUNT_WITH_EMAIL_AND_PASSWORD_ERROR_CODE.WEAK_PASSWORD]:
    "パスワードが弱すぎます",
} as const;

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
      if (isAuthError(e)) {
        return {
          success: false,
          message: SIGNUP_EMAIL_ERROR_MESSAGE[e.code] ?? "エラーが発生しました",
        };
      } else {
        throw e;
      }
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
  authTokenCookie.client.destory();
  router.push("/signin");
};

export const subscribeAuthTokenChangeAndRefresh = () => {
  return subscribeAuthTokenChanged((authToken) => {
    if (authToken) {
      authTokenCookie.client.set(authToken);
    } else {
      authTokenCookie.client.destory();
    }
  });
};
