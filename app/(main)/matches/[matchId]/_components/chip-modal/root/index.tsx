import { Modal } from "@/components/modal";
import { serverServices } from "@/lib/services/server";
import { ChipForm } from "../form";
import { ChipModalController } from "../modal-controller";

export async function ChipModalRoot({ matchId }: { matchId: string }) {
  const { getMatch } = await serverServices();
  const [match] = await Promise.all([getMatch({ matchId })]);

  return (
    <ChipModalController>
      <Modal.Header className="flex justify-between">
        <Modal.Heading>チップ入力</Modal.Heading>
      </Modal.Header>
      <ChipForm match={match} />
    </ChipModalController>
  );
}
