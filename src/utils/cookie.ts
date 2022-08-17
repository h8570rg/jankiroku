import { destroyCookie, parseCookies, setCookie } from "nookies";
import { isBrowser } from "./common";

export const COOKIE_NAME = {
  AUTH_TOKEN: "auth_token",
} as const;

type CookieName = "auth_token";

const cookie = (
  cookieName: CookieName,
  options?: {
    maxAge?: number;
    path?: string;
  }
) => {
  return {
    get: () => {
      if (!isBrowser()) {
        throw new Error("'cookie.get' function must be called in browser.");
      }
      const cookies = parseCookies();
      const cookie = cookieName in cookies ? undefined : cookies[cookieName];
      return cookie;
    },
    set: (value: string) => {
      if (!isBrowser()) {
        throw new Error("'cookie.set' function must be called in browser.");
      }
      setCookie(null, cookieName, value, options);
    },
    destory: () => {
      if (!isBrowser()) {
        throw new Error("'cookie.destory' function must be called in browser.");
      }
      destroyCookie(null, cookieName);
    },
  };
};

export const authTokenCookie = cookie(COOKIE_NAME.AUTH_TOKEN, {
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
});
