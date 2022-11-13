import { AuthInfo } from "~/lib/types";

export const isBrowser = () => typeof window !== "undefined";

export const isAnonymous = (authInfo: AuthInfo) =>
  authInfo.firebase.sign_in_provider === "anonymous";
