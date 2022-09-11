import {
  GetServerSideProps,
  GetServerSidePropsContext,
  PreviewData,
} from "next";
import { config } from "~/lib/config";
import { authTokenCookie, refreshTokenCookie } from "~/lib/cookie";
import { genError, isDomainError } from "~/lib/error";
import { auth } from "~/lib/server/firebase";
import { getUser } from "~/lib/server/services/user";
import { AuthInfo, User } from "~/types";
import { isAnonymous } from "~/utils/common";
import { refreshAuthToken, verifyAuthToken } from "../server/services/auth";

export function withBase(next: GetServerSideProps): GetServerSideProps {
  return async function (ssrContext: GetServerSidePropsContext) {
    try {
      return await next(ssrContext);
    } catch (e) {
      if (isDomainError(e)) {
        switch (e.name) {
          case "missingRefreshToken":
            refreshTokenCookie.ssr.destory(ssrContext);
            return {
              redirect: {
                destination: "/signin",
                permanent: false,
              },
            };
          case "missingAuthToken":
            authTokenCookie.ssr.destory(ssrContext);
            return {
              redirect: {
                destination: "/signin",
                permanent: false,
              },
            };
          case "authTokenNotVerified":
            authTokenCookie.ssr.destory(ssrContext);
            return {
              redirect: {
                destination: "/signin",
                permanent: false,
              },
            };
          case "emailNotVerified":
            return {
              redirect: {
                destination: "/signin/email-verify",
                permanent: false,
              },
            };
          case "userNotFound":
            return {
              redirect: {
                destination: "/signup/user",
                permanent: false,
              },
            };
        }
      }
      throw e;
    }
  };
}

export type GetServerSidePropsWithAuth<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends { [key: string]: any } = { [key: string]: any },
  // eslint-disable-next-line @typescript-eslint/ban-types
  Q extends NodeJS.Dict<string | string[]> = {},
  D extends PreviewData = PreviewData
> = GetServerSideProps<P, Q, D> extends (context: infer U) => infer R
  ? (context: U, user: User) => R
  : never;

/**
 * 認証必須
 */
export function withAuth(next: GetServerSidePropsWithAuth): GetServerSideProps {
  return withBase(async (ssrContext) => {
    const refreshToken = refreshTokenCookie.ssr.get(ssrContext);

    if (!refreshToken) {
      throw genError("missingRefreshToken");
    }

    let authToken = authTokenCookie.ssr.get(ssrContext);
    let authInfo: AuthInfo | undefined = undefined;

    if (authToken) {
      const result = await verifyAuthToken(authToken);
      if (!result.success) {
        throw genError("authTokenNotVerified");
      }
      // ここで取れた場合は代入。二回fetchしない。
      authInfo = result.authInfo;
    }

    if (!authToken) {
      const refreshTokenResult = await refreshAuthToken(refreshToken);
      if (!refreshTokenResult.success) {
        throw genError("missingRefreshToken");
      }
      authToken = refreshTokenResult.authToken;
    }

    if (!authInfo) {
      const _authInfo = await auth.verifyIdToken(authToken).catch(() => {
        throw genError("authTokenNotVerified");
      });
      authInfo = _authInfo;
    }

    authTokenCookie.ssr.set(ssrContext, authToken);

    if (!isAnonymous(authInfo) && !authInfo.email_verified) {
      throw genError("emailNotVerified");
    }

    const user = await getUser(authInfo.uid);

    if (!user) {
      throw genError("userNotFound");
    }

    return next(ssrContext, user);
  });
}
