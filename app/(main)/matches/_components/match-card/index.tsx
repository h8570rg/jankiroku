import { Avatar, AvatarGroup } from "@/components/avatar";
import { CardBody, CardHeader } from "@/components/card";
import { Divider } from "@/components/divider";
import type { Match } from "@/lib/type";
import { dayjs } from "@/lib/utils/date";
import { NavigationCard } from "./card";

export function MatchCard({ match, userId }: { match: Match; userId: string }) {
  const { createdAt } = match;
  const today = dayjs();
  const targetDate = dayjs(createdAt);
  const isSameYear = today.isSame(targetDate, "year");
  const displayDate = isSameYear
    ? dayjs(createdAt).format("M/D")
    : dayjs(createdAt).format("YYYY/M/D");

  const data = match.players.find((player) => player.id === userId);

  if (!data) return null;

  return (
    <NavigationCard matchId={match.id}>
      <CardHeader>
        <div className="flex w-full items-center justify-between">
          <p>{displayDate}</p>
          <AvatarGroup size="sm" isBordered max={4}>
            {match.players.map((player) => (
              <Avatar key={player.id} />
            ))}
          </AvatarGroup>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex items-center">
          <div className="flex shrink-0 grow flex-col items-center px-8">
            <div className="mb-2 text-xs text-default-500">平均着順</div>
            <div className="text-lg">
              {data.averageRank?.toFixed(2) ?? "なし"}
            </div>
          </div>
          <div className="flex basis-[224px] justify-center">
            <table className="[&_td]:text-center [&_th]:w-10 [&_th]:text-center">
              <thead className="text-xs text-default-500">
                <tr>
                  <th>1位</th>
                  <th>2位</th>
                  <th>3位</th>
                  {match.rule.playersCount === 4 && <th>4位</th>}
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td>{data.rankCounts[0]}</td>
                  <td>{data.rankCounts[1]}</td>
                  <td>{data.rankCounts[2]}</td>
                  {match.rule.playersCount === 4 && (
                    <td>{data.rankCounts[3]}</td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardBody>
    </NavigationCard>
  );
}
