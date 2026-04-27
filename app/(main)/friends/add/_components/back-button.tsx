"use client";

import { ChevronLeft } from "lucide-react";
import NextLink from "next/link";
import { buttonVariants } from "@/components/button";

export function BackButton() {
  return (
    <NextLink
      className={buttonVariants({ isIconOnly: true, variant: "ghost" })}
      href="/friends"
      aria-label="戻る"
    >
      <ChevronLeft />
    </NextLink>
  );
}
