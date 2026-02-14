"use client";

import {
  ChartColumn,
  ChevronLeft,
  CircleDollar,
  FileText,
  PersonPlus,
} from "@gravity-ui/icons";
import NextLink from "next/link";
import { buttonVariants } from "@/components/button";
import { ChipModalTrigger } from "../chip-modal";
import { DataModalTrigger } from "../data-modal";
import { PlayersModalTrigger } from "../players-modal";
import { RuleModalTrigger } from "../rule-modal";

export function MatchHeader() {
  return (
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
        <DataModalTrigger
          className={buttonVariants({
            isIconOnly: true,
            variant: "ghost",
          })}
        >
          <ChartColumn />
        </DataModalTrigger>
        <RuleModalTrigger
          className={buttonVariants({
            isIconOnly: true,
            variant: "ghost",
          })}
        >
          <FileText />
        </RuleModalTrigger>
        <ChipModalTrigger
          className={buttonVariants({
            isIconOnly: true,
            variant: "ghost",
          })}
        >
          <CircleDollar />
        </ChipModalTrigger>
        <PlayersModalTrigger
          className={buttonVariants({
            isIconOnly: true,
            variant: "ghost",
          })}
        >
          <PersonPlus />
        </PlayersModalTrigger>
      </div>
    </div>
  );
}
