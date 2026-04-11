"use client";

import NextLink from "next/link";
import { buttonVariants } from "@/components/button";

export function HeroCtaLinks() {
  return (
    <div className="flex justify-center gap-4">
      <NextLink
        className={buttonVariants({ size: "lg", variant: "primary" })}
        href="/login"
      >
        今すぐ始める
      </NextLink>
      <a
        className={buttonVariants({
          size: "lg",
          variant: "outline",
        })}
        href="#features"
      >
        詳しく見る
      </a>
    </div>
  );
}
