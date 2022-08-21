import { cookie } from "~/utils/cookie";

export const authTokenCookie = cookie("auth_token", {
  maxAge: 60 * 60 * 1,
  path: "/",
});

export const refreshTokenCookie = cookie("refresh_token", {
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
});
