import classNames from "classnames";
import { Metadata } from "next";
import { IconDefs } from "@/components/Icon";
import { ToastContainer } from "@/lib/toast";
import { righteous, mPlus1p } from "./fonts";
import "./globals.css";
import { NextUIProvider } from "./nextUiProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | Janreco",
    default: "Janreco",
  },
  description: "麻雀成績管理アプリ",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={classNames(righteous.variable, mPlus1p.variable, "h-full")}
      suppressHydrationWarning
    >
      {/* @see https://github.com/shadowwalker/next-pwa */}
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#b8e986" />
      </head>
      <body className="h-full font-mplus">
        <IconDefs />
        <NextUIProvider>
          <div className="h-full bg-background text-foreground">{children}</div>
          <ToastContainer />
        </NextUIProvider>
      </body>
    </html>
  );
}
