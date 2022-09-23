import { useEffect } from "react";
import { authTokenCookie, refreshTokenCookie } from "~/lib/cookie";
import { subscribeAuthStateChanged } from "~/lib/services/auth";

export const useAuthTokenRefresh = () => {
  useEffect(() => {
    return subscribeAuthStateChanged(async (user) => {
      if (!user) {
        return;
      }
      const authToken = await user.getIdToken();
      const refreshToken = user.refreshToken;
      authTokenCookie.client.set(authToken);
      refreshTokenCookie.client.set(refreshToken);
    });
  }, []);
};
