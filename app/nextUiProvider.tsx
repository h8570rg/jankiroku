"use client";

import { NextUIProvider as _NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * @see https://nextui.org/docs/frameworks/nextjs#tailwind-css-setup
 */
export function NextUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <_NextUIProvider className="h-full">
      <NextThemesProvider attribute="class" defaultTheme="system">
        {children}
      </NextThemesProvider>
    </_NextUIProvider>
  );
}
