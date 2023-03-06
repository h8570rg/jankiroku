import SWRMutation from "swr/mutation";
import { z } from "zod";

import { schema as apiSchema } from "~/pages/api/signup/email";

export const signupEmailSchema = z.object({
  email: apiSchema.post.shape.body.shape.email,
  password: apiSchema.post.shape.body.shape.password,
});

export type SignupEmailSchema = z.infer<typeof signupEmailSchema>;

export const useSignupEmail = () => {
  const swr = SWRMutation(
    "/api/signup/email",
    (url, { arg }: { arg: SignupEmailSchema }) => {
      return fetch(url, {
        method: "POST",
        body: JSON.stringify(arg),
      });
    }
  );
  return swr;
};
