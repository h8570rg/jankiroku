import { useEffect } from "react";
import { subscribeAuthTokenChangeAndRefresh } from "~/services/auth";

export const useAuthTokenRefresh = () => {
  useEffect(() => {
    return subscribeAuthTokenChangeAndRefresh();
  }, []);
};
