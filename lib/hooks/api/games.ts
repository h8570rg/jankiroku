import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { z } from "zod";
import { Game } from "~/lib/services/game";
import { Rule } from "~/lib/services/match";
import { get, post } from "~/lib/utils/request";
import { schemas } from "~/lib/utils/schemas";

export const useGames = (matchId: string, initialData?: Game[]) => {
  return useSWR<Game[]>(
    `/api/matches/${matchId}/games`,
    async (url) => {
      const games = await get<Game[]>(url);
      return games;
    },
    {
      fallbackData: initialData,
    },
  );
};

export const useGameAdd = (matchId: string, rule: Rule) => {
  return useSWRMutation(
    `/api/matches/${matchId}/games`,
    async (_, { arg }: { arg: GameAddSchema }) => {
      const match = await post<void>(`/api/matches/${matchId}/games`, {
        ...arg,
        rule,
      });
      return match;
    },
  );
};

export const gameAddSchema = ({ playersCount, defaultPoints }: Rule) =>
  z.object({
    playerPoints: z
      .array(
        z.object({
          profileId: schemas.profileId,
          name: z.string(),
          points: schemas.points,
        }),
      )
      .refine(
        (playerPoints) => {
          return (
            playerPoints.filter(({ points }) => points !== undefined).length ===
            playersCount
          );
        },
        {
          path: ["root"],
          message: `${playersCount}人分の点数を入力してください`,
        },
      )
      .refine(
        (playerPoints) => {
          const total = playerPoints.reduce((acc, { points }) => {
            return acc + (points ?? 0);
          }, 0);
          return total === playersCount * defaultPoints;
        },
        (playerPoints) => {
          const total = playerPoints.reduce((acc, { points }) => {
            return acc + (points ?? 0);
          }, 0);
          return {
            path: ["root"],
            message: `点数の合計が${(
              playersCount * defaultPoints
            ).toLocaleString()}点になるように入力してください。\n現在: ${total.toLocaleString()}点`,
          };
        },
      ),
    crackBoxPlayerId: schemas.profileId
      .transform((v) => v || undefined)
      .optional(),
  });
export type GameAddSchema = z.infer<ReturnType<typeof gameAddSchema>>;
