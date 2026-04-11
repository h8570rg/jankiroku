import { z } from "zod";
import { schema } from "@/lib/utils/schema";

export const createCreateGameSchema = ({
  playersCount,
  defaultPoints,
}: {
  playersCount: number;
  defaultPoints: number;
}) =>
  z
    .object({
      players: z.array(
        z.object({
          id: schema.profileId,
          points: schema.points.optional(),
          name: schema.name,
        }),
      ),
      crackBoxPlayerId: schema.profileId.optional(),
    })
    .superRefine(({ players }, ctx) => {
      const filledCount = players.filter(
        ({ points }) => points !== undefined,
      ).length;
      if (filledCount !== playersCount) {
        ctx.addIssue({
          code: "custom",
          message: `${playersCount}人分の点数を入力してください`,
          path: ["players"],
        });
      }
    })
    .superRefine(({ players }, ctx) => {
      const total = players.reduce((acc, { points }) => {
        return acc + (points ?? 0);
      }, 0);
      const expected = playersCount * defaultPoints;
      if (total !== expected) {
        const diff = expected - total;
        ctx.addIssue({
          code: "custom",
          message: `点数の合計が${expected.toLocaleString()}点になるように入力してください\n${diff.toLocaleString()}点${diff > 0 ? "足りません" : "多いです"}`,
          path: ["players"],
        });
      }
    })
    .superRefine(({ players, crackBoxPlayerId }, ctx) => {
      const underZeroPointsPlayerExists = players.some(
        ({ points }) => typeof points === "number" && points < 0,
      );
      if (!underZeroPointsPlayerExists && crackBoxPlayerId !== undefined) {
        ctx.addIssue({
          code: "custom",
          message: "0点を下回るプレイヤーがいません",
          path: ["crackBoxPlayerId"],
        });
      }
    });
