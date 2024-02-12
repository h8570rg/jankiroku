import useSWR from "swr";
import { Match } from "~/lib/services/match";
import { get } from "~/lib/utils/request";

export const useMatch = (match: Match) => {
  return useSWR(`/api/matches/${match.id}`, (url) => get<Match>(url), {
    fallbackData: match,
  });
};
