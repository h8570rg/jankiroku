import { ModalBody, ModalHeader } from "@/components/Modal";
import { serverServices } from "@/lib/services/server";
import { AnonymousPlayerSelect } from "./AnonymousPlayerSelect";
import { ModalController } from "./ModalController";
import { PlayerTypeTabs } from "./Tabs";
import { UserSelect } from "./UserSelect";

export async function MatchPlayerInputModal({ matchId }: { matchId: string }) {
  const { getFriends, getMatch } = serverServices();
  const [friends, match] = await Promise.all([
    getFriends(),
    getMatch({ matchId }),
  ]);

  return (
    <ModalController>
      <ModalHeader>プレイヤー追加</ModalHeader>
      <ModalBody>
        <div className="flex h-[400px] max-h-[70dvh] flex-col">
          <PlayerTypeTabs
            userTab={
              <UserSelect
                friends={friends}
                matchId={matchId}
                playerIds={match.players.map((player) => player.id)}
              />
            }
            anonymousTab={<AnonymousPlayerSelect matchId={matchId} />}
          />
        </div>
      </ModalBody>
    </ModalController>
  );
}
