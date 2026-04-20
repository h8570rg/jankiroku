"use client";

import { useOverlayState } from "@heroui/react";
import { ChevronLeft, FileText, UserPlus } from "lucide-react";
import NextLink from "next/link";
import { Button, buttonVariants } from "@/components/button";
import type { Match, Profile } from "@/lib/type";
import { PlayersDrawer } from "../players-drawer";
import { RuleModal } from "../rule-modal";

export function MatchHeader({
  match,
  friends,
  matchId,
}: {
  match: Match;
  friends: Profile[];
  matchId: string;
}) {
  const ruleModal = useOverlayState();
  const playersModal = useOverlayState();

  return (
    <>
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <NextLink
            className={buttonVariants({ isIconOnly: true, variant: "ghost" })}
            href="/matches"
            aria-label="戻る"
          >
            <ChevronLeft />
          </NextLink>
          {/* TODO: fetch */}
          {/* <p>{displayDate}</p> */}
        </div>
        <div className="flex items-center gap-0.5">
          <Button
            isIconOnly
            variant="ghost"
            aria-label="ルールを確認"
            onClick={ruleModal.open}
            className={buttonVariants({
              isIconOnly: true,
              variant: "ghost",
            })}
          >
            <FileText />
          </Button>

          <Button
            isIconOnly
            variant="ghost"
            aria-label="プレイヤーを追加"
            onClick={playersModal.open}
            className={buttonVariants({
              isIconOnly: true,
              variant: "ghost",
            })}
          >
            <UserPlus />
          </Button>
        </div>
      </div>

      <RuleModal
        isOpen={ruleModal.isOpen}
        onOpenChange={ruleModal.setOpen}
        rule={match.rule}
      />
      <PlayersDrawer
        isOpen={playersModal.isOpen}
        onOpenChange={playersModal.setOpen}
        matchId={matchId}
        friends={friends}
        players={match.players}
      />
    </>
  );
}
