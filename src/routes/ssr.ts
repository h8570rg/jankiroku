import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from "next";
import { AuthInfo } from "@types";
import { auth } from "~/firebase/admin";
import { authTokenCookie } from "~/lib/cookie";

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
  ? (context: U, authInfo: AuthInfo) => R
  : never;

/**
 * 認証必須
 */
export function withAuth(next: GetServerSidePropsWithAuth): GetServerSideProps {
  // TODO: middlewareでもいいかも
  return withBase(async (ssrContext) => {
    const authToken = authTokenCookie.ssr.get(ssrContext);

    const redirectSigninPage: GetServerSidePropsResult<{ uid: string }> = {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };

    if (!authToken) {
      return redirectSigninPage;
    }

    try {
      const authInfo: AuthInfo = await auth.verifyIdToken(authToken);
      return next(ssrContext, authInfo);
    } catch {
      return redirectSigninPage;
    }
  });
}
