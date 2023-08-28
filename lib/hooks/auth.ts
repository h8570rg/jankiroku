import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { z } from "zod";

import { toast } from "~/lib/toast";
import { post } from "~/lib/utils/request";
import { schemas } from "~/lib/utils/schemas";
import { createSupabaseClient } from "~/lib/utils/supabase/clientComponentClient";

export const useEmailSignIn = () => {
  const router = useRouter();
  return useSWRMutation(
    "user",
    async (_, { arg }: { arg: EmailSignInSchema }) => {
      await post("/api/auth/sign-in", arg);
    },
    {
      onSuccess: () => router.push("/"),
      onError: () => toast.error("メールアドレスまたはパスワードが違います"),
      throwOnError: false,
    }
  );
};
export const emailSignInSchema = z.object({
  email: schemas.email,
  password: schemas.password,
});
export type EmailSignInSchema = z.infer<typeof emailSignInSchema>;

export const useGoogleSignIn = () => {
  const router = useRouter();
  const supabase = createSupabaseClient();
  return useSWRMutation(
    "user",
    async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    },
    {
      onSuccess: () => router.push("/"),
    }
  );
};

export const useEmailSignUp = () => {
  const router = useRouter();

  return useSWRMutation(
    "user",
    async (_, { arg }: { arg: EmailSignUpSchema }) => {
      await post("/api/auth/sign-up", arg);
    },
    {
      onSuccess: () => {
        toast.info("アカウントを作成しました");
        router.push("/login");
      },
      onError: (error) => {
        if (error.message === "User already registered") {
          toast.error("既に登録されているメールアドレスです");
        }
      },
      throwOnError: false,
    }
  );
};
export const emailSignUpSchema = z.object({
  email: schemas.email,
  password: schemas.password,
});
export type EmailSignUpSchema = z.infer<typeof emailSignInSchema>;

export const useSessionGet = () => {
  const supabase = createSupabaseClient();
  return useSWRMutation("session", async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  });
};
