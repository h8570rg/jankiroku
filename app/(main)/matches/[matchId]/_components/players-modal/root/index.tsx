import { serverServices } from "@/lib/services/server";
import { PlayersModalContent } from "../content";
import { PlayersModalController } from "../modal-controller";

export async function PlayersModalRoot({ matchId }: { matchId: string }) {
  const { getFriends, getMatch } = await serverServices();
  const [friends, match] = await Promise.all([
    getFriends(),
    getMatch({ matchId }),
  ]);

  const isDefaultOpen = match.players.length <= 1;

  return (
    <PlayersModalController isDefaultOpen={isDefaultOpen}>
      <PlayersModalContent
        friends={friends}
        matchId={matchId}
        players={match.players}
      />
    </PlayersModalController>
  );
}
