"use client";

import { Skeleton } from "@heroui/react";
import { ChevronLeft } from "lucide-react";
import NextLink from "next/link";
import { buttonVariants } from "@/components/button";

/**
 * 成績表の読み込み中。ヘッダーと表の形をそのまま残し、戻るボタンだけは先に押せるようにする。
 * buttonVariants がクライアントの関数なので Client Component にしている。
 */
export default function Loading() {
  return (
    <div className="flex h-full flex-col" aria-busy="true">
      <div className="mb-1 flex items-center justify-between">
        <NextLink
          className={buttonVariants({ isIconOnly: true, variant: "ghost" })}
          href="/matches"
          aria-label="戻る"
        >
          <ChevronLeft />
        </NextLink>
        <div className="flex items-center gap-2 pr-2">
          <Skeleton className="size-6 rounded-lg" />
          <Skeleton className="size-6 rounded-lg" />
        </div>
      </div>
      <div className="pb-6">
        <Skeleton className="mb-1 h-10 rounded-3xl" />
        <div className="space-y-2 py-2">
          {Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((id) => (
            <Skeleton key={id} className="h-6 rounded-lg" />
          ))}
        </div>
        <div className="mt-1 space-y-1.5">
          <Skeleton className="h-12 rounded-3xl" />
          <Skeleton className="h-12 rounded-3xl" />
        </div>
        <Skeleton className="mt-6 h-52 rounded-3xl" />
      </div>
    </div>
  );
}
