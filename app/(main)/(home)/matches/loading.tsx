import { MatchCardSkeleton } from "./_components/match-card";

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
