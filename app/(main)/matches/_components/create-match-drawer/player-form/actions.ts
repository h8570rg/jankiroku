"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { createMatch as createMatchData } from "@/lib/data/match";
import type { RuleOutput } from "../rule-form/schema";
import { createPlayerStepSchema } from "./schema";

export async function createMatch(ruleData: RuleOutput, _prevState: unknown, formData: FormData) {
  const submission = parseSubmission(formData);
  const playerStepSchema = createPlayerStepSchema(ruleData.playersCount);
  const result = playerStepSchema.safeParse({
    playerIds: Array.isArray(submission.payload.playerIds)
      ? submission.payload.playerIds
      : [submission.payload.playerIds],
  });

  if (!result.success) {
    return report(submission, {
      error: { issues: result.error.issues },
    });
  }

  const { playerIds } = result.data;

  const { id } = await createMatchData({
    ...ruleData,
    playerIds,
  });

  // 一覧は遷移後も <Activity> で隠れて残る。ブラウザバックで戻ったときに新しい成績表が出るよう、先に更新しておく
  refresh();
  redirect(`/matches/${id}`);
}
