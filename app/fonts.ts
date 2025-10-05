import classNames from "classnames";
import { Righteous, RocknRoll_One } from "next/font/google";

const righteous = Righteous({
	variable: "--font-righteous",
	weight: ["400"],
	subsets: ["latin"],
	display: "swap",
});

const rocknRollOne = RocknRoll_One({
	variable: "--font-rocknroll-one",
	weight: ["400"],
	subsets: ["latin"],
	display: "swap",
});

export const fontClassNames = classNames(
	righteous.variable,
	rocknRollOne.variable,
);
