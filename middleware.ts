import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "~/lib/database.types";

// 認証の必要ないページのパス
const noAuthPaths = ["/login", "/sign-up"];
const authPaths = ["/matches", "/match/[id]"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  /**
   * @see https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
   */
  const supabase = createMiddlewareClient<Database>({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  if (
    noAuthPaths.some((path) => pathname.startsWith(path)) ||
    pathname === "/"
  ) {
    return res;
  }

  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return res;
}

/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
