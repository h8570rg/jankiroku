import { cn } from "@heroui/react";
import { RocknRoll_One } from "next/font/google";

const rocknRollOne = RocknRoll_One({
  variable: "--font-rocknroll-one",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const fontClassNames = cn(rocknRollOne.variable);
