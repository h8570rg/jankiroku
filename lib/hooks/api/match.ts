import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { Match, Matches } from "~/lib/models/match";
import { get, post } from "~/lib/utils/request";

export const useMatches = (initialData: Matches) => {
  return useSWR("/api/matches", () => get<Matches>("/api/matches"), {
    fallbackData: initialData,
  });
};

export const useMatchCreate = () => {
  return useSWRMutation("/api/matches", () => post<Match>("/api/matches"));
};
