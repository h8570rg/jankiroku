import { Separator, Typography } from "@heroui/react";
import type { Metadata } from "next";
import { LoginForm } from "./_components/login-form";
import { SocialProviders } from "./_components/social-providers";

export const metadata: Metadata = {
  title: "ログイン",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <Typography type="h1" className="mx-auto mb-4 w-fit text-lg">
        ログイン
      </Typography>
      <SocialProviders />
      <div className="my-4 flex items-center gap-4">
        <Separator className="shrink" />
        <span>or</span>
        <Separator className="shrink" />
      </div>
      <LoginForm />
    </div>
  );
}
