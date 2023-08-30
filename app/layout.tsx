import classNames from "classnames";
import { Metadata } from "next";

import { ToastContainer } from "~/lib/toast";

import { notoSansJp, righteous } from "./fonts";
import "./globals.css";
import { NextUIProvider } from "./nextUiProvider";

// do not cache this layout
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={classNames(notoSansJp.variable, righteous.variable)}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <NextUIProvider>
          <main className="bg-background text-foreground">{children}</main>
          <ToastContainer />
        </NextUIProvider>
      </body>
    </html>
  );
}
