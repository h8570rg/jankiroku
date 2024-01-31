import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { Match } from "~/lib/services/match";
import { get, post } from "~/lib/utils/request";

export const useMatch = (match: Match) => {
  return useSWR(`/api/matches/${match.id}`, (url) => get<Match>(url), {
    fallbackData: match,
  });
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
