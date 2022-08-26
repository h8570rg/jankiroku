import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

export type GetLayout = (page: ReactElement) => ReactNode;

type NextPageWithLayout = NextPage & {
  getLayout?: GetLayout;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
