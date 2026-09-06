import { Skeleton } from "@heroui/react";
import { UserSkeleton } from "@/components/user";

export default function FriendsLoading() {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-10 min-w-0 flex-1 rounded-xl" />
        <Skeleton className="size-10 shrink-0 rounded-lg" />
      </div>
      <ul className="space-y-1">
        {Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((id) => (
          <li className="flex items-center justify-between py-2" key={id}>
            <UserSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}
