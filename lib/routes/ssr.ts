import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { authTokenCookie, refreshTokenCookie } from "~/lib/cookie";
import { isDomainError } from "~/lib/error";

export function withBase(next: GetServerSideProps): GetServerSideProps {
  return async function (context: GetServerSidePropsContext) {
    try {
      return await next(context);
    } catch (e) {
      if (isDomainError(e)) {
        switch (e.name) {
          case "missingRefreshToken":
            refreshTokenCookie.ssr.destory(context);
            return {
              redirect: {
                destination: "/signin",
                permanent: false,
              },
            };
          case "missingAuthToken":
            authTokenCookie.ssr.destory(context);
            return {
              redirect: {
                destination: "/signin",
                permanent: false,
              },
            };
          case "authTokenNotVerified":
            authTokenCookie.ssr.destory(context);
            return {
              redirect: {
                destination: "/signin",
                permanent: false,
              },
            };
          case "emailNotVerified":
            return {
              redirect: {
                destination: "/signup/email-verify",
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

// type GetServerSidePropsWithAuth<
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   P extends { [key: string]: any } = { [key: string]: any },
//   Q extends ParsedUrlQuery = ParsedUrlQuery,
//   D extends PreviewData = PreviewData
// > = GetServerSideProps<P, Q, D> extends (context: infer U) => infer R
//   ? (context: U, data: { authInfo: AuthInfo }) => R
//   : never;

// export function withAuth(next: GetServerSidePropsWithAuth): GetServerSideProps {
//   return withBase(async (context) => {
//     const refreshToken = refreshTokenCookie.ssr.get(context);

//     if (!refreshToken) {
//       throw genError("missingRefreshToken");
//     }

//     let authToken = authTokenCookie.ssr.get(context);

//     if (!authToken) {
//       const refreshTokenResult = await refreshAuthToken(refreshToken);
//       if (!refreshTokenResult.success) {
//         throw genError("missingRefreshToken");
//       }
//       authToken = refreshTokenResult.authToken;
//       authTokenCookie.ssr.set(context, authToken);
//     }

//     const result = await verifyAuthToken(authToken);
//     if (!result.success) {
//       throw genError("authTokenNotVerified");
//     }
//     const authInfo = result.authInfo;

//     return next(context, { authInfo });
//   });
// }

// type GetServerSidePropsWithAuthVerified<
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   P extends { [key: string]: any } = { [key: string]: any },
//   Q extends ParsedUrlQuery = ParsedUrlQuery,
//   D extends PreviewData = PreviewData
// > = GetServerSideProps<P, Q, D> extends (context: infer U) => infer R
//   ? (context: U, data: { authInfo: AuthInfo }) => R
//   : never;

// export function withAuthVerified(
//   next: GetServerSidePropsWithAuthVerified
// ): GetServerSideProps {
//   return withAuth(async (context, { authInfo }) => {
//     if (!isAnonymous(authInfo) && !authInfo.email_verified) {
//       throw genError("emailNotVerified");
//     }
//     return next(context, { authInfo });
//   });
// }

// type GetServerSidePropsWithUser<
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   P extends { [key: string]: any } = { [key: string]: any },
//   Q extends ParsedUrlQuery = ParsedUrlQuery,
//   D extends PreviewData = PreviewData
// > = GetServerSideProps<P, Q, D> extends (context: infer U) => infer R
//   ? (context: U, data: { user: User }) => R
//   : never;

// export function withUser(next: GetServerSidePropsWithUser): GetServerSideProps {
//   return withAuthVerified(async (context, { authInfo }) => {
//     const user = await getUser(authInfo.uid);

//     if (!user) {
//       throw genError("userNotFound");
//     }

//     return next(context, { user });
//   });
// }
