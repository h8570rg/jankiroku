import { parseSubmission } from "@conform-to/react/future";
import { type RuleOutput, ruleSchema } from "./schema";

/** ルールフォームは Drawer 内でクライアント送信のみ（サーバーアクションなし）。 */
export function parseRuleFormSubmission(formData: FormData): RuleOutput {
  return ruleSchema.parse(parseSubmission(formData).payload);
}
