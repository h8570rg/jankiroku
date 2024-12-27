import { serverServices } from "@/lib/services/server";
import { RuleModalContent } from "../Content";
import { RuleModalController } from "../ModalController";

export async function RuleModalRoot({ matchId }: { matchId: string }) {
  const { getMatch } = await serverServices();
  const match = await getMatch({ matchId });

  return (
    <RuleModalController>
      <RuleModalContent rule={match.rule} />
    </RuleModalController>
  );
}
