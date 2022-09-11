import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import { useCallback, useRef } from "react";
import { useForm, SubmitHandler, ControllerProps } from "react-hook-form";
import { useLoading } from "~/hooks/loading";
import { useToast } from "~/hooks/toast";
import { sendEmailVerification, signup } from "~/lib/services/auth";

type FormInput = {
  email: string;
  password: string;
  passwordRepeat: string;
};

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<FormInput>({ reValidateMode: "onSubmit" });
  const loading = useLoading();
  const toast = useToast();
  const password = useRef({});
  password.current = watch("password", "");

  const rules: Record<keyof FormInput, ControllerProps["rules"]> = {
    email: {
      required: {
        value: true,
        message: "入力してください",
      },
    },
    password: {
      required: {
        value: true,
        message: "入力してください",
      },
    },
    passwordRepeat: {
      validate: (value) =>
        value === password.current || "パスワードが一致しません",
    },
  };

  const signupEmail = useCallback(
    async (email: string, password: string) => {
      const res = await signup.email(email, password);
      if (!res.success) {
        switch (res.cause) {
          case "email":
            setError("email", { type: "custom", message: res.message });
            return;
          case "password":
            setError("password", { type: "custom", message: res.message });
            return;
          case "other":
            setError("email", { type: "custom", message: res.message });
            return;
        }
      }
      await sendEmailVerification();
      toast.add({ content: "email send" });
    },
    [setError, toast]
  );

  const onSubmit: SubmitHandler<FormInput> = useCallback(
    async ({ email, password }) => {
      loading.wait(signupEmail(email, password));
    },
    [loading, signupEmail]
  );

  return (
    <main className="p-2">
      <h1>アカウントを作成</h1>
      <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className="block text-red-900 border-red-500"
          label="email"
          type="text"
          autoComplete="email"
          placeholder="メールアドレス"
          error={!!errors.email}
          color="primary"
          helperText={errors.email?.message}
          {...register("email", rules.email)}
        />
        <TextField
          className="block"
          label="password"
          type="password"
          autoComplete="new-password"
          placeholder="パスワード"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password", rules.password)}
        />
        <TextField
          className="block"
          label="password"
          type="password"
          autoComplete="new-password"
          placeholder="パスワード"
          error={!!errors.passwordRepeat}
          helperText={errors.passwordRepeat?.message}
          {...register("passwordRepeat", rules.passwordRepeat)}
        />
        <LoadingButton
          variant="contained"
          type="submit"
          loading={loading.value}
        >
          送信
        </LoadingButton>
      </form>
    </main>
  );
}
