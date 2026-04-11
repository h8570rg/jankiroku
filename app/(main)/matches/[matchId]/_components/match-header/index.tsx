"use client";

import { useOverlayState } from "@heroui/react";
import { ChartColumn, ChevronLeft, FileText, UserPlus } from "lucide-react";
import NextLink from "next/link";
import { Button, buttonVariants } from "@/components/button";
import type { Match, Profile } from "@/lib/type";
import { DataModal } from "../data-modal";
import { PlayersModal } from "../players-modal";
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
  const dataModal = useOverlayState();
  const ruleModal = useOverlayState();
  const playersModal = useOverlayState();

  return (
    <>
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <NextLink
            className={buttonVariants({ isIconOnly: true, variant: "ghost" })}
            href="/matches"
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
            onClick={dataModal.open}
            className={buttonVariants({
              isIconOnly: true,
              variant: "ghost",
            })}
          >
            <ChartColumn />
          </Button>
          <Button
            isIconOnly
            variant="ghost"
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

      <DataModal
        isOpen={dataModal.isOpen}
        onOpenChange={dataModal.setOpen}
        match={match}
      />
      <RuleModal
        isOpen={ruleModal.isOpen}
        onOpenChange={ruleModal.setOpen}
        rule={match.rule}
      />
      <PlayersModal
        isOpen={playersModal.isOpen}
        onOpenChange={playersModal.setOpen}
        matchId={matchId}
        friends={friends}
        players={match.players}
      />
    </>
  );
}
