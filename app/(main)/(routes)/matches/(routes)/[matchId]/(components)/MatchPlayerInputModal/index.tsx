import { serverServices } from "@/lib/services/server";
import { MatchPlayerInputModalContent } from "./(components)/Content";
import { ModalController } from "./(components)/ModalController";

export async function MatchPlayerInputModal({
  matchId,
  defaultOpen,
}: {
  matchId: string;
  defaultOpen: boolean;
}) {
  const { getFriends, getMatch } = serverServices();
  const [friends, match] = await Promise.all([
    getFriends(),
    getMatch({ matchId }),
  ]);

  return (
    <ModalController defaultOpen={defaultOpen}>
      <MatchPlayerInputModalContent
        friends={friends}
        matchId={matchId}
        players={match.players}
      />
    </ModalController>
  );
}
