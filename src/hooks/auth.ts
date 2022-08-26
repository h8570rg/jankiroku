import { useEffect } from "react";
import { authTokenCookie, refreshTokenCookie } from "~/lib/cookie";
import { subscribeAuthTokenChange } from "~/services/auth";

export const useAuthTokenRefresh = () => {
  useEffect(() => {
    return subscribeAuthTokenChange((authToken, refreshToken) => {
      if (authToken) {
        authTokenCookie.client.set(authToken);
      }
      if (refreshToken) {
        refreshTokenCookie.client.set(refreshToken);
      }
    });
  }, []);
};
