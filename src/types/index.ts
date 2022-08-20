import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";

export type Auth = {
  loadingUser: boolean;
  signedIn: boolean;
  signOut: VoidFunction;
  user: User | undefined;
};

export type User = {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
};

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
