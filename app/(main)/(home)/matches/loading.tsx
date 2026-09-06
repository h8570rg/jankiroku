import { Skeleton } from "@heroui/react";

function MatchCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-4 w-16 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <Skeleton className="h-16 w-full rounded-lg" />
    </div>
  );
}

export default function Loading() {
  return (
    <ul className="space-y-4">
      {Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((id) => (
        <li key={id}>
          <MatchCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
