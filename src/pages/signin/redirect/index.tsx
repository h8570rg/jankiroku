import { Typography } from "@mui/material";
import { getRedirectResult } from "firebase/auth";
import Router from "next/router";
import React, { useEffect } from "react";
import Div100vh from "react-div-100vh";
import { authTokenCookie } from "~/lib/cookie";
import { auth } from "~/lib/firebase/client";
import { Method, METHOD, signin } from "~/services/auth";
import { getMe } from "~/services/user";

export default function Signin() {
  const loadingText = "Loading";

  const getTextBouncingStyle = (i: number) =>
    ({
      animationDelay: `${i * 0.1}s`,
    } as React.CSSProperties);

  const onLoad = async () => {
    const userCredential = await getRedirectResult(auth);

    // リダイレクト前
    if (!userCredential) {
      const method = Router.query.method as Method;

      switch (method) {
        case METHOD.GOOGLE:
          signin.redirect.google();
          return;
        case METHOD.EMAIL:
          // TODO
          return;
        default:
          Router.push("/");
          return;
      }
    }

    // リダイレクト後
    const authToken = await auth.currentUser?.getIdToken();

    if (!authToken) {
      throw "aaaaa";
      Router.push("/signin");
      return;
    }

    // リダイレクトしたときにすでにcookieがセットされているように
    authTokenCookie.client.set(authToken);

    const user = getMe(userCredential.user.uid);

    if (!user) {
      Router.push("/signup/user");
      return;
    }

    Router.push("/");

    // TODO
    // オープンリダイレクタ等を回避するために検証が必要だが、ここでは省略
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Div100vh className="flex items-center">
      <Typography className="w-fit mx-auto font-righteous tracking-widest text-2xl">
        {loadingText.split("").map((t, i) => (
          <span
            key={i}
            className="inline-block animate-waviy"
            style={getTextBouncingStyle(i)}
          >
            {t}
          </span>
        ))}
      </Typography>
    </Div100vh>
  );
}
