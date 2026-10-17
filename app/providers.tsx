"use client";

import { Toast } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // legacy: release-notes modal 削除後の残骸掃除
    localStorage.removeItem("lastVersion");
  }, []);

  return (
    <NextThemesProvider attribute="class" defaultTheme="system">
      {children}
      <Toast.Provider />
    </NextThemesProvider>
  );
}
