"use client";
import classNames from "classnames";
import { Button } from "~/components/Button";
import { GoogleIcon } from "~/components/SocialProviderIcon";
import { createClient } from "~/lib/utils/supabase/client";
import { getURL } from "~/lib/utils/url";

export function SocialProviders({ className }: { className?: string }) {
  const handleGoogleSignInClick = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getURL()}api/auth/callback`,
      },
    });
  };
  return (
    <ul className={classNames("flex py-4", className)}>
      <SocialProviderItem
        label="Google でログイン"
        onClick={handleGoogleSignInClick}
      >
        <GoogleIcon className="w-full" />
      </SocialProviderItem>
    </ul>
  );
}
function SocialProviderItem({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: VoidFunction;
}) {
  return (
    <li className="w-full">
      <Button
        className="flex w-full items-center justify-center gap-3 bg-default-100"
        size="lg"
        radius="md"
        onClick={onClick}
      >
        <span className="w-5">{children}</span>
        <span>{label}</span>
      </Button>
    </li>
  );
}
