import { getRedirectResult } from "firebase/auth";
import Router from "next/router";
import React, { useEffect } from "react";
import Div100vh from "react-div-100vh";
import { BouncingText } from "~/components/BouncingText";
import { authTokenCookie } from "~/lib/cookie";
import { genError } from "~/lib/error";
import { auth } from "~/lib/firebase";
import { Method, METHOD, signin } from "~/lib/services/auth";
import { getUser } from "~/lib/services/user";

export default function Signin() {
  const onLoad = async () => {
    const userCredential = await getRedirectResult(auth);

    // リダイレクト前
    if (!userCredential) {
      const method = Router.query.method as Method;

      switch (method) {
        case METHOD.GOOGLE:
          signin.redirect.google();
          return;
        default:
          Router.push("/");
          return;
      }
    }

    // リダイレクト後
    const authToken = await auth.currentUser?.getIdToken();

    if (!authToken) {
      throw genError("missingAuthToken");
    }

    // リダイレクトしたときにすでにcookieがセットされているように
    authTokenCookie.client.set(authToken);

    const user = getUser(userCredential.user.uid);

    if (!user) {
      Router.push("/signup/user");
      return;
    }

    Router.push("/");
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Div100vh className="flex items-center">
      <BouncingText
        text="loading"
        className="w-fit mx-auto font-righteous tracking-widest text-2xl"
      />
    </Div100vh>
  );
}
