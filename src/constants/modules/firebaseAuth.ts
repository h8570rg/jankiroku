export const ERROR_CODE = {
  EMAIL_EXISTS: "auth/email-already-in-use",
  INVALID_EMAIL: "auth/invalid-email",
  INVALID_PASSWORD: "auth/wrong-password",
  POPUP_BLOCKED: "auth/popup-blocked",
  USER_DELETED: "auth/user-not-found",
  USER_DISABLED: "auth/user-disabled",
  USER_MISMATCH: "auth/user-mismatch",
  WEAK_PASSWORD: "auth/weak-password",
} as const;

export const ERROR_MESSAGE: { [key: string]: string } = {
  [ERROR_CODE.EMAIL_EXISTS]: "このメールアドレスは使用されています",
  [ERROR_CODE.INVALID_EMAIL]: "メールアドレスの形式が正しくありません",
  [ERROR_CODE.INVALID_PASSWORD]: "メールアドレスまたはパスワードが違います",
  [ERROR_CODE.POPUP_BLOCKED]:
    "認証ポップアップがブロックされました。ポップアップブロックをご利用の場合は設定を解除してください",
  [ERROR_CODE.USER_DELETED]: "メールアドレスまたはパスワードが違います",
  [ERROR_CODE.USER_DISABLED]: "サービスの利用が停止されています",
  [ERROR_CODE.USER_MISMATCH]: "メールアドレスまたはパスワードが違います",
  [ERROR_CODE.WEAK_PASSWORD]: "パスワードが弱すぎます",
} as const;
