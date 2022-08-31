import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { useCallback } from "react";
import Div100vh from "react-div-100vh";
import {
  Controller,
  ControllerProps,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useLoading } from "~/hooks/loading";
import { useToast } from "~/hooks/toast";
import { sendPasswordResetEmail as _sendPasswordResetEmail } from "~/services/auth";
type FormInput = {
  email: string;
};

const rules: Record<keyof FormInput, ControllerProps["rules"]> = {
  email: {
    required: {
      value: true,
      message: "入力してください",
    },
  },
};

export default function ResetPasswordPage() {
  const loading = useLoading();
  const { add: addToast } = useToast();
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<FormInput>({ reValidateMode: "onSubmit" });

  const sendPasswordResetEmail = useCallback(
    async (email: string) => {
      const res = await _sendPasswordResetEmail(email);
      if (!res.success) {
        setError("email", { type: "custom", message: res.message });
        return;
      }
      addToast({ content: "success" });
    },
    [addToast, setError]
  );

  const onSubmit: SubmitHandler<FormInput> = useCallback(
    ({ email }) => {
      loading.wait(sendPasswordResetEmail(email));
    },
    [loading, sendPasswordResetEmail]
  );

  return (
    <Div100vh className="flex items-center relative overflow-hidden">
      <Container className="max-w-sm px-6 max-h-full overflow-y-auto py-10">
        <Typography variant="h5" component="h1" className="mb-10">
          パスワード再設定
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={rules.email}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="メールアドレス"
                type="text"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            className="w-full rounded-full mt-4"
            loading={loading.value}
          >
            再設定メールを送信
          </LoadingButton>
        </form>
        <NextLink href="/signin" passHref>
          <Link className="inline">ログインに戻る</Link>
        </NextLink>
      </Container>
    </Div100vh>
  );
}
