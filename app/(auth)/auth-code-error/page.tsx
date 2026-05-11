"use client";

import { cn, Text } from "@heroui/react";
import NextLink from "next/link";
import { buttonVariants } from "@/components/button";

/**
 * @see https://supabase.com/docs/guides/auth/server-side/oauth-with-pkce-flow-for-ssr
 */
export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-col items-center">
      <Text type="h1">ログインに失敗しました</Text>
      <NextLink className={cn(buttonVariants(), "mt-4")} href="/login">
        ログイン画面へ戻る
      </NextLink>
    </div>
  );
}
