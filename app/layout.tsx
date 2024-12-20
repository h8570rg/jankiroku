import classNames from "classnames";
import { Metadata } from "next";
import { IconDefs } from "@/components/Icon";
import { ToastContainer } from "@/lib/toast";
import { fontClassNames } from "./fonts";
import "./globals.css";
import { NextUIProvider } from "./nextUiProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | Janreco",
    default: "Janreco",
  },
  description:
    "麻雀成績管理ウェブアプリです。無料で使え、簡単に麻雀の成績を記録することができます。",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={classNames(fontClassNames, "h-full scroll-smooth")}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="h-full font-rocknroll">
        <IconDefs />
        <NextUIProvider>
          <div className="h-full bg-background text-foreground">{children}</div>
          <ToastContainer />
        </NextUIProvider>
      </body>
    </html>
  );
}
