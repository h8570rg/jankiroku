import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  async redirects() {
    return [
      // 新規登録はログイン画面の OTP フローに統合済み。
      // permanent（308）はブラウザに残り続け /sign-up を再利用できなくなるため一時リダイレクトにする
      { source: "/sign-up", destination: "/login", permanent: false },
    ];
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
