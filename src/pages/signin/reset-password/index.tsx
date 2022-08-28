import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useCallback } from "react";
import Div100vh from "react-div-100vh";
import { Controller, ControllerProps, useForm } from "react-hook-form";

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
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<FormInput>({ reValidateMode: "onSubmit" });

  const onSubmit = useCallback(() => {
    //
  }, []);

  return (
    <Div100vh className="flex items-center relative overflow-hidden">
      <Container className="max-w-sm px-6 max-h-full overflow-y-auto py-10">
        <Typography variant="h5" component="h1" className="font-bold mb-10">
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
            // loading={loading.value}
          >
            再設定メールを送信
          </LoadingButton>
        </form>
      </Container>
    </Div100vh>
  );
}
