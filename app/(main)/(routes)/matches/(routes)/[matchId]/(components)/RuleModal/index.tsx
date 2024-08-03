import { serverServices } from "@/lib/services/server";
import { RuleModalContent } from "./(components)/Content";
import { ModalController } from "./(components)/ModalController";

export async function RuleModal({ matchId }: { matchId: string }) {
  const { getMatch } = serverServices();
  const match = await getMatch({ matchId });

  return (
    <ModalController>
      <RuleModalContent rule={match.rule} />
    </ModalController>
  );
}
