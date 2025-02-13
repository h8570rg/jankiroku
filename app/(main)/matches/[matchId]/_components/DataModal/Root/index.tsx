import { ModalBody, ModalHeader } from "@/components/Modal";
import { serverServices } from "@/lib/services/server";
import { DataChart } from "../Chart";
import { DataModalController } from "../ModalController";
import { Summary } from "../Summary";

export async function DataModalRoot({ matchId }: { matchId: string }) {
  const { getMatch } = await serverServices();
  const [match] = await Promise.all([getMatch({ matchId })]);

  return (
    <DataModalController>
      <ModalHeader>データ</ModalHeader>
      <ModalBody className="overflow-y-auto">
        <DataChart className="shrink-0" match={match} />
        <Summary match={match} />
      </ModalBody>
    </DataModalController>
  );
}
