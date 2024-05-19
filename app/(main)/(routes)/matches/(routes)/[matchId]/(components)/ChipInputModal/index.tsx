import { ModalHeader } from "@/components/Modal";
import { serverServices } from "@/lib/services/server";
import { ChipInputForm } from "./(components)/Form";
import { ChipInputModalController } from "./(components)/ModalController";

export async function ChipInputModal({ matchId }: { matchId: string }) {
  const { getMatch } = serverServices();
  const [match] = await Promise.all([getMatch({ matchId })]);

  return (
    <ChipInputModalController>
      <ModalHeader className="flex justify-between">チップ入力</ModalHeader>
      <ChipInputForm match={match} />
    </ChipInputModalController>
  );
}
