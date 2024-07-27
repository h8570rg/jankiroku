import { Righteous, M_PLUS_1p } from "next/font/google";

export const righteous = Righteous({
  variable: "--font-righteous",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const mPlus1p = M_PLUS_1p({
  variable: "--font-m-plus-1p",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});
