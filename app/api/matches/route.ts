import type { NextRequest } from "next/server";
import { z } from "zod";
import { MATCHES_PAGE_SIZE } from "@/lib/config";
import { getMatches } from "@/lib/data/match";

const beforeSchema = z.iso.datetime({ offset: true });

/**
 * 成績表一覧の続きを返す（無限スクロール用）。
 * 1 ページ目は Server Component で取得するため、`before` は必須。
 */
export async function GET(request: NextRequest) {
  const before = beforeSchema.safeParse(request.nextUrl.searchParams.get("before"));
  if (!before.success) {
    return Response.json({ error: "Invalid before" }, { status: 400 });
  }

  const matches = await getMatches({ before: before.data, limit: MATCHES_PAGE_SIZE });
  return Response.json(matches);
}
