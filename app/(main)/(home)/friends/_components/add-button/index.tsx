"use client";

import { UserPlus } from "lucide-react";
import NextLink from "next/link";
import { buttonVariants } from "@/components/button";

export function AddButton() {
  return (
    <NextLink
      className={buttonVariants({ isIconOnly: true, variant: "ghost" })}
      href="/friends/add"
      aria-label="フレンド追加"
    >
      <UserPlus />
    </NextLink>
  );
}
