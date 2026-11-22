import { cn } from "@heroui/react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { SERVICE_NAME, THEME_COLOR } from "@/lib/config";
import "./globals.css";
import { getURL } from "@/lib/utils/url";
import { fontClassNames } from "./fonts";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: {
    template: `%s | ${SERVICE_NAME}`,
    default: SERVICE_NAME,
  },
  description:
    "麻雀の成績を自動計算・記録・分析できる無料Webアプリ。対局ごとの成績をウマ・オカ・チップ対応で管理。フレンドと成績表を共有できます。",
  robots: {
    index: false,
    follow: false,
  },
  // ホーム画面に追加したときの iOS の表示。ステータスバーはページに重ねない（default）
  appleWebApp: {
    title: SERVICE_NAME,
    statusBarStyle: "default",
  },
};

// テーマは OS 設定に従う（next-themes の defaultTheme="system"）ので、タイトルバーの色も OS 設定で出し分ける
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLOR.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLOR.dark },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      className={cn(fontClassNames, "scroll-smooth")}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="bg-background font-rocknroll text-foreground">
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
