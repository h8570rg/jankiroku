import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { z } from "zod";
import { Match } from "~/lib/services/match";
import { CreateMatchPayload, Matches } from "~/lib/services/matches";
import { get, post } from "~/lib/utils/request";
import { schemas } from "~/lib/utils/schemas";

export const useMatch = (matchId: string, initialData: Match) => {
  return useSWR(`/api/matches/${matchId}`, (url) => get<Match>(url), {
    fallbackData: initialData,
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
