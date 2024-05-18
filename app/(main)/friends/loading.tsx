import { User } from "~/components/User";

export default function Loading() {
  return (
    <div>
      <div className="mb-4 flex h-10 items-center justify-between">
        <h1 className="heading-1">フレンド</h1>
      </div>
      <ul className="space-y-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <li
            className="flex items-center justify-between py-2"
            key={`friends-skeleton-${i}`}
          >
            <User skeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}
