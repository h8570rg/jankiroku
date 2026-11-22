import type { MetadataRoute } from "next";
import { SERVICE_NAME, THEME_COLOR } from "@/lib/config";

/**
 * @see https://nextjs.org/docs/app/guides/progressive-web-apps
 * @see https://web.dev/articles/add-manifest
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    // start_url を変えても同じアプリとして扱われるよう、id は固定する
    id: "/",
    name: SERVICE_NAME,
    short_name: SERVICE_NAME,
    description: "麻雀成績管理アプリ",
    lang: "ja",
    start_url: "/matches",
    scope: "/",
    display: "standalone",
    // manifest ではライト・ダークを出し分けられない。アイコンの地色に近いダークの背景色にそろえる。
    // 表示中のタイトルバーの色は layout.tsx の viewport.themeColor が優先される
    theme_color: THEME_COLOR.dark,
    background_color: THEME_COLOR.dark,
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
