import { serverServices } from "~/lib/services/server";
import { CreateMatchButton } from "./CreateMatchButton";
import { MatchCard } from "./MatchCard";

export default async function Matches() {
  const { getMatches } = serverServices();

  // TODO: infinite scroll
  const matches = await getMatches({});

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
            <MatchCard matchId={match.id} date={match.createdAt} />
          </li>
        ))}
      </ul>
      <div className="fixed inset-x-0 bottom-0 z-10 p-4">
        <CreateMatchButton className="w-full" />
      </div>
    </div>
  );
}
