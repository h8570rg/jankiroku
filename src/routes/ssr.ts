import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from "next";
import { auth } from "@lib/firebase/admin";
import { config } from "~/core/config";
import { authTokenCookie, refreshTokenCookie } from "~/lib/cookie";

export function withBase(next: GetServerSideProps): GetServerSideProps {
  return async function (ssrContext: GetServerSidePropsContext) {
    return await next(ssrContext);
  };
}

export type GetServerSidePropsWithAuth<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends { [key: string]: any } = { [key: string]: any },
  // eslint-disable-next-line @typescript-eslint/ban-types
  Q extends NodeJS.Dict<string | string[]> = {},
  D extends PreviewData = PreviewData
> = GetServerSideProps<P, Q, D> extends (context: infer U) => infer R
  ? (context: U, uid: string) => R
  : never;

const redirectSigninPage: GetServerSidePropsResult<{ uid: string }> = {
  redirect: {
    destination: "/signin",
    permanent: false,
  },
};

/**
 * 認証必須
 */
export function withAuth(next: GetServerSidePropsWithAuth): GetServerSideProps {
  return withBase(async (ssrContext) => {
    const authToken = authTokenCookie.ssr.get(ssrContext);
    const refreshToken = refreshTokenCookie.ssr.get(ssrContext);

    if (!authToken || !refreshToken) {
      return redirectSigninPage;
    }

    if (authToken) {
      try {
        const authInfo = await auth.verifyIdToken(authToken);
        return next(ssrContext, authInfo.uid);
      } catch (e: any) {
        // 予測されるエラー
        if (e.code !== "auth/id-token-expired") {
          throw e;
        }
      }
    }

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
            refreshToken,
          }),
        }
      )
    ).json();

    if (refreshTokenResult.error) {
      throw refreshTokenResult.error;
    }

    const newAuthToken = refreshTokenResult["id_token"];
    authTokenCookie.ssr.set(ssrContext, newAuthToken);
    const uid = refreshTokenResult["user_id"];
    return next(ssrContext, uid);
  });
}
