import { serverServices } from "@/lib/services/server";
import { CreateMatchButton } from "./(components)/CreateMatchButton";
import { MatchCard } from "./(components)/MatchCard";

export default async function Matches() {
  const { getMatches, getUser } = await serverServices();

  // TODO: infinite scroll
  const [matches, user] = await Promise.all([getMatches({}), getUser()]);
  return (
    <div>
      <h1 className="heading-1 mb-1">成績表</h1>
      {matches.length === 0 && (
        <p className="break-auto mt-14 text-center text-small text-foreground-light">
          まだ成績表がありません。
          <br />
          「ゲームを始める」ボタンから、新しい成績表を作成しましょう。
        </p>
      )}
      <ul className="space-y-4">
        {matches?.map((match) => (
          <li key={match.id}>
            <MatchCard match={match} userId={user.id} />
          </li>
        ))}
      </ul>
      <div className="sticky inset-x-0 bottom-0 z-10 bg-gradient-to-t from-background p-4">
        <CreateMatchButton className="w-full" />
      </div>
    </div>
  );
}
