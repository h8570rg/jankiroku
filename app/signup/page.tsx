"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

import { signupSchema, SignupSchema, useSignup } from "~/lib/hooks/auth";

export default function Signup() {
  const router = useRouter();
  const { trigger: signupEmail } = useSignup();

  const { register, handleSubmit } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupSchema> = async (data) => {
    await signupEmail(data);
    router.push("/dashboard");
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section>
            <label htmlFor="email">email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              {...register("email")}
            />
          </section>
          <section>
            <label htmlFor="new-password">password</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              required
              {...register("password")}
            />
          </section>
          <button>signup</button>
        </form>
      </div>
    </>
  );
}
