/** @type {import('tailwindcss').Config} */
const config = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				righteous: ["var(--font-righteous)"],
				rocknroll: ["var(--font-rocknroll-one)"],
			},
			height: {
				screen: ["100vh", "100dvh"],
			},
			minHeight: {
				screen: ["100vh", "100dvh"],
			},
			maxHeight: {
				screen: ["100vh", "100dvh"],
			},
			wordBreak: {
				test: "break-all",
			},
		},
	},
};

export default config;
