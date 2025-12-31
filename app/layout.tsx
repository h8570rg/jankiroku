import classNames from "classnames";
import type { Metadata } from "next";
import { IconDefs } from "@/components/Icon";
import { SERVICE_NAME } from "@/lib/config";
import { fontClassNames } from "./fonts";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    template: `%s | ${SERVICE_NAME}`,
    default: SERVICE_NAME,
  },
  description:
    "麻雀成績管理ウェブアプリです。無料で使え、簡単に麻雀の成績を記録することができます。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
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
      <body className="h-full font-rocknroll">
        <IconDefs />
        <Providers>
          <div className="h-full bg-background text-foreground">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
