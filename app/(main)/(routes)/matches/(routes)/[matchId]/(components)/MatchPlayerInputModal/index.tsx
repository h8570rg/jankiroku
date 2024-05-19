import { ModalBody, ModalHeader } from "@/components/Modal";
import { serverServices } from "@/lib/services/server";
import { AnonymousTab } from "./(components)/AnonymousTab";
import { ModalController } from "./(components)/ModalController";
import { MatchPlayerInputTabs } from "./(components)/Tabs";
import { UserTab } from "./(components)/UserTab";

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
          <MatchPlayerInputTabs
            userTab={
              <UserTab
                friends={friends}
                matchId={matchId}
                playerIds={match.players.map((player) => player.id)}
              />
            }
            anonymousTab={<AnonymousTab matchId={matchId} />}
          />
        </div>
      </ModalBody>
    </ModalController>
  );
}
