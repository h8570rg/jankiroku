import useSWRMutation from "swr/mutation";
import { Profile } from "~/lib/services/profile";
import { get } from "~/lib/utils/request";

export const useProfilesSearch = () => {
  return useSWRMutation(
    "/api/profiles/search",
    async (
      url,
      {
        arg,
      }: {
        arg: {
          text: string;
        };
      },
    ) => {
      const profiles = await get<Profile[]>(url, arg);
      return profiles;
    },
  );
};
