import { User } from "@/components/User";

export default function FriendsLoading() {
  return (
    <div>
      <div className="mb-4 flex h-10 items-center justify-between">
        <h1 className="heading-1">フレンド</h1>
      </div>
      <ul className="space-y-1">
        {Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((id) => (
          <li className="flex items-center justify-between py-2" key={id}>
            <User skeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}
