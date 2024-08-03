import { serverServices } from "@/lib/services/server";
import { MatchPlayerInputModalContent } from "./(components)/Content";
import { ModalController } from "./(components)/ModalController";

export async function MatchPlayerInputModal({ matchId }: { matchId: string }) {
  const { getFriends, getMatch } = serverServices();
  const [friends, match] = await Promise.all([
    getFriends(),
    getMatch({ matchId }),
  ]);

  const isDefaultOpen = match.players.length <= 1;

  return (
    <ModalController isDefaultOpen={isDefaultOpen}>
      <MatchPlayerInputModalContent
        friends={friends}
        matchId={matchId}
        players={match.players}
      />
    </ModalController>
  );
}
