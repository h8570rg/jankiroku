import {
  GetServerSideProps,
  GetServerSidePropsContext,
  PreviewData,
} from "next";
import { config } from "~/core/config";
import { authTokenCookie, refreshTokenCookie } from "~/lib/cookie";
import { genError, isDomainError } from "~/lib/error";
import { auth, firestore } from "~/lib/firebase/admin";
import { AuthInfo, User } from "~/types";
import { isAnonymous } from "~/utils/common";

export function withBase(next: GetServerSideProps): GetServerSideProps {
  return async function (ssrContext: GetServerSidePropsContext) {
    try {
      return await next(ssrContext);
    } catch (e: any) {
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
    const cookieAuthToken = authTokenCookie.ssr.get(ssrContext);
    const cookieRefreshToken = refreshTokenCookie.ssr.get(ssrContext);

    if (!cookieRefreshToken) {
      throw genError("missingRefreshToken");
    }

    let verifiedAuthToken: string | undefined = undefined;
    let authInfo: AuthInfo | undefined = undefined;

    if (cookieAuthToken) {
      const _authInfo = await auth.verifyIdToken(cookieAuthToken).catch(() => {
        return;
      });
      if (_authInfo) {
        verifiedAuthToken = cookieAuthToken;
        // ここで取れた場合は代入。二回fetchしない。
        authInfo = _authInfo;
      }
    }

    if (!verifiedAuthToken) {
      // refreshTokenを使い新しいauthTokenを取得
      /**
       * @see https://firebase.google.com/docs/reference/rest/auth/#section-refresh-token
       */
      const refreshTokenResult = await (
        await fetch(
          `https://securetoken.googleapis.com/v1/token?key=${config.public.firebase.apiKey}`,
          {
            method: "post",
            body: JSON.stringify({
              grant_type: "refresh_token",
              cookieRefreshToken,
            }),
          }
        )
      ).json();

      const refreshedAuthToken = refreshTokenResult["id_token"] as
        | string
        | undefined;

      if (!refreshedAuthToken) {
        throw genError("missingRefreshToken");
      }

      verifiedAuthToken = refreshedAuthToken;
    }

    if (!authInfo) {
      const _authInfo = await auth
        .verifyIdToken(verifiedAuthToken)
        .catch(() => {
          throw genError("authTokenNotVerified");
        });
      authInfo = _authInfo;
    }

    authTokenCookie.ssr.set(ssrContext, verifiedAuthToken);

    if (!isAnonymous(authInfo) && !authInfo.email_verified) {
      throw genError("emailNotVerified");
    }

    const user = (
      await firestore.collection("users").doc(authInfo.uid).get()
    ).data() as User; // TODO

    if (!user) {
      throw genError("userNotFound");
    }

    return next(ssrContext, user);
  });
}
