import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { ModalHeader } from "@/components/modal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { serverServices } from "@/lib/services/server";
import { GameForm } from "../form";
import { GameModalController } from "../modal-controller";

export async function GameModalRoot({ matchId }: { matchId: string }) {
  const { getMatch } = await serverServices();
  const [match] = await Promise.all([getMatch({ matchId })]);

  return (
    <GameModalController>
      <ModalHeader className="flex justify-between">
        <div>結果入力</div>
        <Popover size="sm" color="secondary">
          <PopoverTrigger>
            <Button className="gap-1" variant="light" size="sm">
              <span className="text-secondary underline">同点の場合</span>
              <Icon className="size-4 fill-secondary" name="help" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-w-[280px] py-2">
            点数が同じプレイヤーがいる場合、順番が先のプレイヤーの着順が上になります。名前の左のアイコンをドラッグ&ドロップして順番を変更できます。
          </PopoverContent>
        </Popover>
      </ModalHeader>
      <GameForm match={match} />
    </GameModalController>
  );
}
