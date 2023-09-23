import useSWRMutation from "swr/mutation";
import { z } from "zod";
import { UpdateProfilePayload } from "~/lib/services/profile";
import { post } from "~/lib/utils/request";
import { schemas } from "~/lib/utils/schemas";

export const useProfileUpdate = ({ userId }: { userId: string }) => {
  return useSWRMutation(
    `/api/profiles/${userId}`,
    async (url, { arg }: { arg: ProfileUpdateSchema }) => {
      const payload: Omit<UpdateProfilePayload, "id"> = arg;
      await post(url, payload);
    },
  );
};

export const profileUpdateSchema = z.object({
  name: schemas.name,
  janrecoId: schemas.janrecoId,
});
export type ProfileUpdateSchema = z.infer<typeof profileUpdateSchema>;
