import { CircleQuestion } from "@gravity-ui/icons";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { Popover } from "@/components/popover";
import { serverServices } from "@/lib/services/server";
import { GameForm } from "../form";
import { GameModalController } from "../modal-controller";

export async function GameModalRoot({ matchId }: { matchId: string }) {
  const { getMatch } = await serverServices();
  const [match] = await Promise.all([getMatch({ matchId })]);

  return (
    <GameModalController>
      <Modal.Header className="flex flex-row items-center justify-between">
        <Modal.Heading>結果入力</Modal.Heading>
        <Popover>
          <Button className="gap-1" variant="ghost" size="sm">
            <span className="text-accent underline">同点の場合</span>
            <CircleQuestion className="text-accent" />
          </Button>
          <Popover.Content className="max-w-[280px] bg-surface-secondary">
            <Popover.Dialog>
              点数が同じプレイヤーがいる場合、順番が先のプレイヤーの着順が上になります。名前の左のアイコンをドラッグ&ドロップして順番を変更できます。
            </Popover.Dialog>
          </Popover.Content>
        </Popover>
      </Modal.Header>
      <GameForm match={match} />
    </GameModalController>
  );
}
