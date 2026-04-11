"use client";

import NextLink from "next/link";
import { buttonVariants } from "@/components/button";
import { NavbarItem } from "@/components/navbar";

export function NavbarActions() {
  return (
    <NavbarItem>
      <NextLink
        className={buttonVariants({ size: "sm", variant: "tertiary" })}
        href="/login"
      >
        ログイン
      </NextLink>
    </NavbarItem>
  );
}
