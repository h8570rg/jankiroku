import { useContext } from "react";
import { AuthContext } from "@/context/auth";

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw Error(
      "`useAuth` hook must be called from a descendent of the `AuthProvider`."
    );
  }

  return ctx;
};
