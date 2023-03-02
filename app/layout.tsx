import classNames from "classnames";
import { Metadata } from "next";

import SupabaseListener from "~/components/SupabaseListener";
import SupabaseProvider from "~/components/SupabaseProvider";
import { createClient } from "~/lib/utils/supabase-server";
import "~/styles/globals.css";

import { notoSansJp, righteous, roboto } from "./fonts";

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
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html
      lang="ja"
      className={classNames(
        notoSansJp.variable,
        righteous.variable,
        roboto.variable
      )}
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
