"use client";

import { cn } from "@heroui/react";
import NextLink from "next/link";
import { buttonVariants } from "@/components/button";

/**
 * @see https://supabase.com/docs/guides/auth/server-side/oauth-with-pkce-flow-for-ssr
 */
export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-col items-center">
      <h1>ログインに失敗しました</h1>
      <NextLink className={cn(buttonVariants(), "mt-4")} href="/login">
        ログイン画面へ戻る
      </NextLink>
    </div>
  );
}
