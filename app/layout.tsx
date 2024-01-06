import classNames from "classnames";
import { Metadata } from "next";
import { IconDefs } from "~/components/Icon";
import { ToastContainer } from "~/lib/toast";
import { notoSansJp, righteous } from "./fonts";
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
      className={classNames(notoSansJp.variable, righteous.variable)}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <IconDefs />
        <NextUIProvider>
          <div className="bg-background text-foreground">{children}</div>
          <ToastContainer />
        </NextUIProvider>
      </body>
    </html>
  );
}
