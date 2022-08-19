import { getRedirectResult } from "firebase/auth";
import router from "next/router";
import { useEffect } from "react";
import { authTokenCookie } from "@lib/cookie";
import { NextPageWithLayout } from "@types";
import { auth } from "~/firebase/client";
import { Method, METHOD, signin } from "~/services/auth";

const Signin: NextPageWithLayout = () => {
  const onLoad = async () => {
    const result = await getRedirectResult(auth);

    // リダイレクト前
    if (!result) {
      const method = router.query.method as Method;

      switch (method) {
        case METHOD.GOOGLE:
          signin.google();
          break;
        case METHOD.EMAIL:
          // TODO
          break;
      }
      return;
    }

    // リダイレクト後
    const authToken = await auth.currentUser?.getIdToken();

    if (!authToken) {
      throw new Error("No user is found.");
    }

    // リダイレクトしたときにすでにcookieがセットされているように
    authTokenCookie.client.set(authToken);

    router.push("/");

    // TODO
    // オープンリダイレクタ等を回避するために検証が必要だが、ここでは省略
  };

  useEffect(() => {
    onLoad();
  }, []);

  return <div>...redirecting</div>;
};

Signin.getLayout = (page) => page;

export default Signin;
