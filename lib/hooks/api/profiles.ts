import useSWRMutation from "swr/mutation";
import { Profile, ProfileExists } from "~/lib/services/profile";
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

export const useProfileExists = () => {
  return useSWRMutation(
    "/api/profiles/exists",
    async (
      url,
      {
        arg,
      }: {
        arg: {
          janrecoId: string;
        };
      },
    ) => {
      const { exists } = await get<ProfileExists>(url, arg);
      return exists;
    },
  );
};
