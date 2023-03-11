import useSWRMutation from "swr/mutation";
import { z } from "zod";

import { useSupabase } from "~/components/SupabaseProvider";
import { commonSchema } from "~/lib/schema";
import { getURL } from "~/lib/utils/url";

export const useSessionGet = () => {
  const { supabase } = useSupabase();
  return useSWRMutation("/auth/session", async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  });
};

export const signupSchema = z.object({
  email: commonSchema.email,
  password: commonSchema.password,
});
export type SignupSchema = z.infer<typeof signupSchema>;

export const useSignup = () => {
  const { supabase } = useSupabase();
  return useSWRMutation(
    "/auth/user",
    async (_, { arg }: { arg: SignupSchema }) => {
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        ...arg,
        options: {
          emailRedirectTo: `${getURL()}signup/email-confirm/`,
        },
      });
      if (error) throw error;
      return user;
    },
    {
      populateCache: (user) => user,
      revalidate: false,
    }
  );
};

export const signinEmailSchema = z.object({
  email: commonSchema.email,
  password: commonSchema.password,
});

export type SigninEmailSchema = z.infer<typeof signinEmailSchema>;

export const useSigninEmail = () => {
  const { supabase } = useSupabase();
  return useSWRMutation(
    "/auth/user",
    async (_, { arg }: { arg: SigninEmailSchema }) => {
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword(arg);
      if (error) throw error;
      return user;
    },
    { populateCache: (user) => user, revalidate: false }
  );
};

export const useSignout = () => {
  const { supabase } = useSupabase();
  return useSWRMutation(
    "/auth/user",
    async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    {
      populateCache: () => undefined,
      revalidate: false,
    }
  );
};
