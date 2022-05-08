import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { createAccountWithEmailAndPassword } from "@/apis/auth";
import { FIREBASE_AUTH } from "@/constants";
import TextField from "src/components/textField";

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
  const [error, setError] = useState<string>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setError(undefined);
      await createAccountWithEmailAndPassword(data.email, data.password);
    } catch (error: any) {
      const errorMessage =
        FIREBASE_AUTH.ERROR_MESSAGE[error.code] ?? "エラーが発生しました";
      setError(errorMessage);
    }
  };

  return (
    <>
      <h1>アカウントを作成</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="email"
          type="email"
          autoComplete="email"
          placeholder="メールアドレス"
          error={errors.email?.message}
          {...register("email", { required: true })}
        />
        <TextField
          label="password"
          type="password"
          autoComplete="new-password"
          placeholder="パスワード"
          error={errors.password?.message}
          {...register("password", {
            required: true,
            minLength: {
              value: 6,
              message: "パスワードは6文字以上にしてください",
            },
          })}
        />
        <input type="submit" value="送信" />
      </form>
      {error}
    </>
  );
};

export default Signup;
