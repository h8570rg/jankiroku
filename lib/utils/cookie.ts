import { GetServerSidePropsContext } from "next";
import nookies, { destroyCookie, parseCookies, setCookie } from "nookies";
import { isBrowser } from "./common";

const defaultOptions = {
  secure: true,
  sameSite: "Lax",
};

export const cookie = (
  cookieName: string,
  options?: {
    maxAge?: number;
    path?: string;
    sameSite?: "Strict" | "Lax" | "None";
    secure?: boolean;
  }
) => {
  const _options = { ...defaultOptions, ...options };
  return {
    client: {
      get: () => {
        if (!isBrowser()) {
          throw new Error(
            "'cookie.client.get' function must be called in browser."
          );
        }
        const cookies = parseCookies();
        const cookie = cookieName in cookies ? cookies[cookieName] : undefined;
        return cookie;
      },
      set: (value: string) => {
        if (!isBrowser()) {
          throw new Error(
            "'cookie.client.set' function must be called in browser."
          );
        }
        setCookie(null, cookieName, value, _options);
      },
      destory: () => {
        if (!isBrowser()) {
          throw new Error(
            "'cookie.client.destory' function must be called in browser."
          );
        }
        destroyCookie(null, cookieName);
      },
    },
    ssr: {
      get: (ctx: GetServerSidePropsContext) => {
        const cookies = nookies.get(ctx);
        const cookie = cookieName in cookies ? cookies[cookieName] : undefined;
        return cookie;
      },
      set: (ctx: GetServerSidePropsContext, value: string) => {
        nookies.set(ctx, cookieName, value, _options);
      },
      destory: (ctx: GetServerSidePropsContext) => {
        destroyCookie(ctx, cookieName);
      },
    },
  };
};
