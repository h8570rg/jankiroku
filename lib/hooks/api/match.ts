import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { Matches } from "~/lib/models/match";
import { get, post } from "~/lib/utils/request";

export const useMatches = (initialData: Matches) => {
  return useSWR("/api/matches", (url) => get<Matches>(url), {
    fallbackData: initialData,
  });
};

export const useMatchCreate = () => {
  return useSWRMutation("/api/matches", (url) => post<Matches>(url));
};
