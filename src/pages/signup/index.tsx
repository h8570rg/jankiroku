import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "@hooks/toast";
import Alert from "@components/alert";
import Button from "@components/button";
import TextField from "@components/textField";
import { signup } from "~/services/auth";

type Inputs = {
  email: string;
  password: string;
};

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    setError(undefined);
    const result = await signup.email(data.email, data.password);
    if (result.success) {
      toast.add({ content: "ログインしました" });
      router.push("/");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <main className="p-2">
      <h1>アカウントを作成</h1>
      <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className="block text-red-900 border-red-500"
          label="email"
          type="email"
          autoComplete="email"
          placeholder="メールアドレス"
          error={!!errors.email}
          color="primary"
          helperText={errors.email?.message}
          {...register("email", { required: true })}
        />
        <TextField
          className="block"
          label="password"
          type="password"
          autoComplete="new-password"
          placeholder="パスワード"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password", {
            required: true,
            minLength: {
              value: 6,
              message: "パスワードは6文字以上にしてください",
            },
          })}
        />
        {!!error && <Alert severity="error">{error}</Alert>}
        <Button variant="contained" type="submit" loading={loading}>
          送信
        </Button>
      </form>
    </main>
  );
};

export default Signup;
