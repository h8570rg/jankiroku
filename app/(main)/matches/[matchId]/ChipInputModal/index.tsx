import { ModalHeader } from "@/components/Modal";
import { serverServices } from "@/lib/services/server";
import { ChipForm } from "./ChipForm";
import { ModalController } from "./ModalController";

export async function ChipInputModal({ matchId }: { matchId: string }) {
  const { getMatch } = serverServices();
  const [match] = await Promise.all([getMatch({ matchId })]);

  return (
    <ModalController>
      <ModalHeader className="flex justify-between">チップ入力</ModalHeader>
      <ChipForm match={match} />
    </ModalController>
  );
}
