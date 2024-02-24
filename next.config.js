/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/matches",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
