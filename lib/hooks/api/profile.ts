import useSWRMutation from "swr/mutation";
import { z } from "zod";
import { AnonymousProfile, UpdateProfilePayload } from "~/lib/services/profile";
import { post } from "~/lib/utils/request";
import { schemas } from "~/lib/utils/schemas";

export const useProfileUpdate = ({ profileId }: { profileId: string }) => {
  return useSWRMutation(
    `/api/profiles/${profileId}`,
    async (url, { arg }: { arg: ProfileUpdateSchema }) => {
      const payload: Omit<UpdateProfilePayload, "id"> = arg;
      await post(url, payload);
    },
  );
};

export const useProfileCreate = () => {
  return useSWRMutation(
    "/api/profiles",
    async (url, { arg }: { arg: { name: string } }) => {
      const data = await post<AnonymousProfile>(url, arg);
      return data;
    },
  );
};

export const profileUpdateSchema = z.object({
  name: schemas.name,
  janrecoId: schemas.janrecoId,
});
export type ProfileUpdateSchema = z.infer<typeof profileUpdateSchema>;
