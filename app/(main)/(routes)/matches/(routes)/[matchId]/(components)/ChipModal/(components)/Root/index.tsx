import { ModalHeader } from "@/components/Modal";
import { serverServices } from "@/lib/services/server";
import { ChipForm } from "../Form";
import { ChipModalController } from "../ModalController";

export async function ChipModalRoot({ matchId }: { matchId: string }) {
  const { getMatch } = await serverServices();
  const [match] = await Promise.all([getMatch({ matchId })]);

  return (
    <ChipModalController>
      <ModalHeader className="flex justify-between">チップ入力</ModalHeader>
      <ChipForm match={match} />
    </ChipModalController>
  );
}
