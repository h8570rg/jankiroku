import useSWRMutation from "swr/mutation";
import { z } from "zod";

import { useSupabase } from "~/components/SupabaseProvider";
import { commonSchema } from "~/lib/schema";
import { getURL } from "~/lib/utils/url";

export namespace authSchema {
  export const signup = z.object({
    email: commonSchema.email,
    password: commonSchema.password,
  });
  export const signinEmail = z.object({
    email: commonSchema.email,
    password: commonSchema.password,
  });

  export type Signup = z.infer<typeof signup>;
  export type SigninEmail = z.infer<typeof signinEmail>;
}

export const useSessionGet = () => {
  const { supabase } = useSupabase();
  const swrMutation = useSWRMutation("session", async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  });
  return swrMutation;
};

// clientから実行する必要があるので、api routesを介さない
export const useAuth = () => {
  const { supabase } = useSupabase();

  const signup = ({ email, password }: authSchema.Signup) =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getURL()}signup/email-confirm/`,
      },
    });

  const signinEmail = ({ email, password }: authSchema.SigninEmail) =>
    supabase.auth.signInWithPassword({ email, password });

  const signout = () => supabase.auth.signOut();

  return {
    signup,
    signinEmail,
    signout,
  };
};
