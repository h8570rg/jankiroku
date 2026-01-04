import { serverServices } from "@/lib/services/server";
import { RuleModalContent } from "../content";
import { RuleModalController } from "../modal-controller";

export async function RuleModalRoot({ matchId }: { matchId: string }) {
  const { getMatch } = await serverServices();
  const match = await getMatch({ matchId });

  return (
    <RuleModalController>
      <RuleModalContent rule={match.rule} />
    </RuleModalController>
  );
}
