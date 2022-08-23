import { UserCredential } from "firebase/auth";
import router from "next/router";
import { authTokenCookie } from "~/lib/cookie";
import {
  createAccountWithEmailAndPassword,
  signInWithGoogle,
  signOut as _signOut,
  isAuthError,
  CREATE_ACCOUNT_WITH_EMAIL_AND_PASSWORD_ERROR_CODE,
  subscribeAuthStateChanged,
  signinWithEmailAndPassword,
  SigninWithEmailAndPasswordErrorCode,
  isSigninWithEmailAndPasswordError,
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

const SIGNIN_EMAIL_ERROR: Record<
  SigninWithEmailAndPasswordErrorCode,
  {
    cause: "email" | "password";
    message: string;
  }
> = {
  "auth/invalid-email": {
    cause: "email",
    message: "メールアドレスの形式が正しくありません",
  },
  "auth/user-disabled": {
    cause: "email",
    message: "無効なユーザーです",
  },
  "auth/user-not-found": {
    cause: "email",
    message: "ユーザーが見つかりませんでした",
  },
  "auth/wrong-password": {
    cause: "password",
    message: "パスワードが間違っています",
  },
};

export const signin = {
  google: async () => {
    await signInWithGoogle();
    router.push("/signin/redirect");
  },
  email: async (
    email: string,
    password: string
  ): Promise<
    | { success: true; userCredential: UserCredential }
    | { success: false; cause: "email" | "password"; message: string }
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
      if (isSigninWithEmailAndPasswordError(e)) {
        return {
          success: false,
          ...SIGNIN_EMAIL_ERROR[e.code],
        };
      } else {
        throw e;
      }
    }
  },
};

export const signOut = () => {
  _signOut();
  authTokenCookie.client.destory();
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
