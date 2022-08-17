import { ReactNode } from "react";
import { useAuthTokenRefresh } from "@/hooks/auth";

export default function AuthProvider({ children }: { children: ReactNode }) {
  useAuthTokenRefresh();
  return <>{children}</>;
}
