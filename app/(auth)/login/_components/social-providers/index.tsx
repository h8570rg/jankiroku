"use client";

import { cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTransition } from "react";
import { Button } from "@/components/button";
import { getIsWebview } from "@/lib/utils/userAgent";
import { signInWithGoogle } from "../login-form/actions";

export function SocialProviders({ className }: { className?: string }) {
  const [isPending, startTransition] = useTransition();

  const handleGoogleClick = () => {
    const isWebview = getIsWebview();
    if (isWebview) {
      window.alert(
        "アプリ内ブラウザではGoogleログインを利用できません。他のブラウザでお試しください。",
      );
      return;
    }
    startTransition(async () => {
      await signInWithGoogle();
    });
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Button
        className="w-full"
        variant="tertiary"
        onPress={handleGoogleClick}
        isPending={isPending}
      >
        <Icon icon="devicon:google" className="w-5" />
        Google でログイン
      </Button>
      <Button
        className="w-full"
        variant="tertiary"
        onPress={() => alert("開発中です、しばらくお待ちください")}
      >
        ログインせずに始める
      </Button>
    </div>
  );
}
