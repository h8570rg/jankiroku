import { cn, Skeleton } from "@heroui/react";
import type { ComponentPropsWithoutRef } from "react";
import { UserAvatar } from "./user-avatar";

export type UserProps = ComponentPropsWithoutRef<"div"> & {
  name: string | null;
  displayId: string | null;
  avatarUrl: string | null;
};

export function User({ name, displayId, avatarUrl, className }: UserProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 rounded-sm",
        className,
      )}
    >
      <UserAvatar avatarUrl={avatarUrl} name={name} />
      <div className="flex flex-col items-start">
        <span className="text-sm text-inherit">{name}</span>
        {displayId && <span className="text-xs text-muted">@{displayId}</span>}
      </div>
    </div>
  );
}

// TODO: Userと高さを合わせる
export function UserSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2 rounded-sm">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-36 rounded-lg" />
        <Skeleton className="h-3 w-24 rounded-lg" />
      </div>
    </div>
  );
}
