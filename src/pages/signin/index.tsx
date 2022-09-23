import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import classNames from "classnames";
import Image from "next/image";
import NextLink from "next/link";
import Router from "next/router";
import { useCallback, useState } from "react";
import Div100vh from "react-div-100vh";
import {
  useForm,
  Controller,
  SubmitHandler,
  ControllerProps,
} from "react-hook-form";
import GoogleIcon from "~/assets/images/g-logo.png";
import MahJong1Image from "~/assets/images/mahjong1.jpeg";
import Logo from "~/components/Logo";
import { useLoading } from "~/hooks/loading";
import { Method, METHOD, signin } from "~/lib/services/auth";

const AnonymousSelectionOverlay = ({
  className,
  onSigninButtonClick,
  onAnonymousSigninButtonClick,
  loading,
}: {
  className?: string;
  onSigninButtonClick: VoidFunction;
  onAnonymousSigninButtonClick: VoidFunction;
  loading: boolean;
}) => {
  return (
    <div className={classNames("relative h-full", className)}>
      <Box
        className="absolute inset-0"
        sx={{ backgroundColor: "primary.main" }}
      ></Box>
      <Image
        src={MahJong1Image}
        layout="fill"
        objectFit="cover"
        className="animate-expansion"
        alt="mahjong"
      />
      <Box
        className="absolute inset-0 opacity-95"
        sx={{ backgroundColor: "primary.main" }}
      ></Box>
      <Box className="absolute inset-0 flex items-center">
        <Container className="max-w-sm">
          <Logo
            variant="h2"
            className="w-fit mx-auto mb-10"
            sx={{
              color: "primary-inverted.main",
            }}
          >
            Janreco
          </Logo>
          <Stack className="space-y-4">
            <LoadingButton
              loading={loading}
              variant="contained"
              size="large"
              className="rounded-full font-bold"
              disableElevation
              color="primary-inverted"
              onClick={onSigninButtonClick}
            >
              ログイン/新規登録
            </LoadingButton>
            <LoadingButton
              loading={loading}
              variant="outlined"
              size="large"
              className="rounded-full font-bold"
              disableElevation
              color="primary-inverted"
              onClick={onAnonymousSigninButtonClick}
            >
              ログインせずに始める
            </LoadingButton>
          </Stack>
        </Container>
      </Box>
    </div>
  );
};

type FormInput = {
  email: string;
  password: string;
};

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
};

export default function Signin() {
  const loading = useLoading();
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<FormInput>({ reValidateMode: "onSubmit" });
  const [showOverlay, setShowOverlay] = useState(true);

  const signinEmail = useCallback(
    async (email: string, password: string) => {
      const res = await signin.email(email, password);

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
      Router.push("/");
    },
    [setError]
  );

  const signinSns = useCallback((method: Method) => {
    // 認証後もとのページに戻ってくるので、先にリダイレクトページに遷移してから認証
    Router.push({
      pathname: "/signin/redirect",
      query: {
        method,
      },
    });
  }, []);

  const signInAnonymous = useCallback(async () => {
    await signin.anonymous();
    Router.push("/");
  }, []);

  const onSubmit: SubmitHandler<FormInput> = useCallback(
    async ({ email, password }) => {
      loading.wait(signinEmail(email, password));
    },
    [loading, signinEmail]
  );

  const handleGoogleSigninClick = useCallback(() => {
    signinSns(METHOD.GOOGLE);
  }, [signinSns]);

  const handleSigninButtonClick = useCallback(() => {
    setShowOverlay(false);
  }, []);

  const handleAnonymousSigninButtonClick = useCallback(() => {
    loading.wait(signInAnonymous());
  }, [loading, signInAnonymous]);

  return (
    <Div100vh className="flex items-center relative overflow-hidden">
      <Container className="max-w-sm px-6 max-h-full overflow-y-auto py-10">
        <Typography
          variant="h5"
          component="h1"
          className="font-bold mx-auto w-fit mb-10"
        >
          ログイン
        </Typography>
        <Stack
          className="w-[300px] mx-auto"
          direction="row"
          justifyContent="center"
        >
          <IconButton className="shadow" onClick={handleGoogleSigninClick}>
            <Image src={GoogleIcon} height={32} width={32} alt="google" />
          </IconButton>
        </Stack>
        <Divider className="my-10">
          <span className="px-3">or</span>
        </Divider>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack className="space-y-5 mx-auto">
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={rules.email}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="メールアドレス"
                  type="text"
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={rules.password}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="パスワード"
                  type="password"
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              className="w-full rounded-full"
              loading={loading.value}
            >
              ログイン
            </LoadingButton>
            <NextLink href="/signin/reset-password" passHref>
              <Link className="w-fit ml-auto text-xs">
                パスワードをお忘れの場合
              </Link>
            </NextLink>
          </Stack>
        </form>
        <p className="text-xs w-fit mx-auto mt-20">
          <span className="mr-1">アカウントをお持ちでない場合</span>
          <NextLink href="/signup" passHref>
            <Link className="inline">アカウントを作成する</Link>
          </NextLink>
        </p>
      </Container>
      <Box
        className={classNames(
          "absolute inset-0 transition-transform duration-[1.2s] ease-in-out",
          { "-translate-y-full": !showOverlay }
        )}
      >
        <AnonymousSelectionOverlay
          loading={loading.value}
          onSigninButtonClick={handleSigninButtonClick}
          onAnonymousSigninButtonClick={handleAnonymousSigninButtonClick}
        />
      </Box>
    </Div100vh>
  );
}
