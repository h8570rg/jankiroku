"use client";

import { User as HeroUiUser, type UserProps } from "@heroui/react";
import { Skeleton } from "@/components/Skeleton";

export function User({
  name,
  displayId,
  skeleton,
  avatarProps,
  ...restProps
}: {
  name?: string | null;
  displayId?: string | null;
  skeleton?: boolean;
} & Omit<UserProps, "name">) {
  if (skeleton) {
    return (
      <div className="inline-flex items-center justify-center gap-2 rounded-small">
        <Skeleton className="size-10 rounded-full" />
        <div className="inline-flex flex-col items-start gap-1">
          <Skeleton className="h-4 w-20 rounded-lg" />
          <Skeleton className="h-3 w-24 rounded-lg" />
        </div>
      </div>
    );
  }
  return (
    <HeroUiUser
      name={name}
      description={displayId && `@${displayId}`}
      avatarProps={{
        name: "",
        ...avatarProps,
      }}
      classNames={{
        base: "align-middle",
      }}
      {...restProps}
    />
  );
}
