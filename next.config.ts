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
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
};

export default nextConfig;
