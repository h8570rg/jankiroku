import Router from "next/router";
import React, { useEffect } from "react";
import Div100vh from "react-div-100vh";
import { BouncingText } from "~/components/BouncingText";
import { authTokenCookie } from "~/lib/cookie";
import { subscribeAuthStateChanged } from "~/lib/services/auth";

export default function SignupEmailVerifyRedirect() {
  useEffect(() => {
    return subscribeAuthStateChanged(async (user) => {
      if (!user) {
        return;
      }
      // email_verifiedを更新するためrefresh
      const authToken = await user.getIdToken(true);
      authTokenCookie.client.set(authToken);
      Router.push("/");
    });
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
