import { Skeleton, Typography } from "@heroui/react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getUserProfile } from "@/lib/data/user";
import { ProfileForm } from "./_components/profile-form";

export const metadata: Metadata = {
  title: "プロフィール編集",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-md">
      <Typography type="h1" className="mx-auto mb-4 w-fit text-lg">
        プロフィール編集
      </Typography>
      <Suspense fallback={<ProfileFormSkeleton />}>
        <ProfileFormSection />
      </Suspense>
    </div>
  );
}

async function ProfileFormSection() {
  const userProfile = await getUserProfile();
  return <ProfileForm userProfile={userProfile} />;
}

function ProfileFormSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="flex justify-center">
        <Skeleton className="size-20 rounded-full" />
      </div>
      {Array.from({ length: 2 }, (_, i) => `skeleton-${i}`).map((id) => (
        <div key={id} className="space-y-2">
          <Skeleton className="h-4 w-20 rounded-lg" />
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-3 w-40 rounded-lg" />
        </div>
      ))}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-16 rounded-3xl" />
      </div>
    </div>
  );
}
