import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { serverServices } from "@/lib/services/server";
import { ProfileForm } from "./_components/profile-form";

export const metadata: Metadata = {
  title: "プロフィール編集",
};

export default async function ProfilePage() {
  const { getUserProfile } = await serverServices();
  const profile = await getUserProfile();

  if (profile.isUnregistered) {
    redirect("/register");
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mx-auto mb-4 w-fit text-lg">プロフィール編集</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
