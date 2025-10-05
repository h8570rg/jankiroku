import type { MetadataRoute } from "next";

/**
 * @see https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps
 */
export default function manifest(): MetadataRoute.Manifest {
	return {
		theme_color: "#2B2A2A",
		background_color: "#2B2A2A",
		display: "standalone",
		scope: "/",
		start_url: "/matches",
		name: "雀鬼録",
		short_name: "雀鬼録",
		description: "麻雀成績管理アプリ",
		icons: [
			{
				src: "/icon-72.png",
				sizes: "72x72",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/icon-96.png",
				sizes: "96x96",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/icon-120.png",
				sizes: "120x120",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/icon-128.png",
				sizes: "128x128",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/icon-144.png",
				sizes: "144x144",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/icon-152.png",
				sizes: "152x152",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/icon-180.png",
				sizes: "180x180",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/icon-192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/icon-384.png",
				sizes: "384x384",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/icon-512.png",
				sizes: "512x512",
				type: "image/png",
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
