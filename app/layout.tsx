import classNames from "classnames";
import { Metadata } from "next";

import SupabaseListener from "~/components/SupabaseListener";
import SupabaseProvider from "~/components/SupabaseProvider";
import { services } from "~/lib/services";

import { notoSansJp, righteous } from "./fonts";
import "./globals.css";

// do not cache this layout
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await services.auth.getSession();

  return (
    <html
      lang="ja"
      className={classNames(notoSansJp.variable, righteous.variable)}
    >
      <body className="font-sans">
        <SupabaseProvider>
          <SupabaseListener serverAccessToken={session?.access_token} />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
