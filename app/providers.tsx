"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * @see https://heroui.org/docs/frameworks/nextjs#tailwind-css-setup
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider className="h-full">
      <NextThemesProvider attribute="class" defaultTheme="system">
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
