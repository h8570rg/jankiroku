import { Typography } from "@heroui/react";
import type { Metadata } from "next";
import { getUserProfile } from "@/lib/data/user";
import { ProfileForm } from "./_components/profile-form";

// TODO(#150): Cache Components 移行のため一時的にブロッキングを許可している。
// Suspense 境界を整理したら外す。https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata: Metadata = {
  title: "プロフィール編集",
};

export default async function ProfilePage() {
  const userProfile = await getUserProfile();

  return (
    <div className="mx-auto max-w-md">
      <Typography type="h1" className="mx-auto mb-4 w-fit text-lg">
        プロフィール編集
      </Typography>
      <ProfileForm userProfile={userProfile} />
    </div>
  );
}
