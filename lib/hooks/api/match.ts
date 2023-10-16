import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { z } from "zod";
import { Match, Rule } from "~/lib/services/match";
import { CreateMatchPayload, Matches } from "~/lib/services/matches";
import { get, post } from "~/lib/utils/request";
import { schemas } from "~/lib/utils/schemas";

export const useMatch = (match: Match) => {
  return useSWR(`/api/matches/${match.id}`, (url) => get<Match>(url), {
    fallbackData: match,
  });
};

export const useMatches = (initialData: Matches) => {
  return useSWR("/api/matches", () => get<Matches>("/api/matches"), {
    fallbackData: initialData,
  });
};

export const useMatchCreate = () => {
  return useSWRMutation(
    "/api/matches",
    async (url, { arg }: { arg: MatchCreateSchema }) => {
      const payload: CreateMatchPayload = arg;
      const match = await post<{ id: string }>(url, payload); // TODO: Match型にする
      return match;
    },
  );
};

export const useMatchPlayerAdd = (matchId: string) => {
  return useSWRMutation(
    `/api/matches/${matchId}`,
    async (_, { arg }: { arg: { profileId: string } }) => {
      const match = await post<void>(`/api/matches/${matchId}/players`, arg);
      return match;
    },
  );
};

export const useGameAdd = (matchId: string, rule: Rule) => {
  return useSWRMutation(
    `/api/matches/${matchId}`,
    async (_, { arg }: { arg: GameAddSchema }) => {
      const match = await post<void>(`/api/matches/${matchId}/games`, {
        ...arg,
        rule,
      });
      return match;
    },
  );
};

export const matchCreateSchema = z.object({
  calcMethod: schemas.calcMethod,
  chipRate: schemas.chipRate,
  crackBoxBonus: schemas.crackBoxBonus,
  defaultCalcPoints: schemas.defaultCalcPoints,
  defaultPoints: schemas.defaultPoints,
  playersCount: schemas.playersCount,
  rate: schemas.rate,
  incline: schemas.incline,
});
export type MatchCreateSchema = z.infer<typeof matchCreateSchema>;

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
