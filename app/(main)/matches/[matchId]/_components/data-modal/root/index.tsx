import { Modal } from "@/components/modal";
import { serverServices } from "@/lib/services/server";
import { DataChart } from "../chart";
import { DataModalController } from "../modal-controller";
import { Summary } from "../summary";

export async function DataModalRoot({ matchId }: { matchId: string }) {
  const { getMatch } = await serverServices();
  const [match] = await Promise.all([getMatch({ matchId })]);

  return (
    <DataModalController>
      <Modal.Header>
        <Modal.Heading>データ</Modal.Heading>
      </Modal.Header>
      <Modal.Body className="overflow-y-auto">
        <DataChart className="shrink-0" match={match} />
        <Summary match={match} />
      </Modal.Body>
    </DataModalController>
  );
}
