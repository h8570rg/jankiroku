import classNames from "classnames";
import { Metadata } from "next";
import "~/styles/globals.css";
import { notoSansJp, righteous, roboto } from "./fonts";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={classNames(
        notoSansJp.variable,
        righteous.variable,
        roboto.variable
      )}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
