/* eslint-disable no-console */
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "~/lib/database.types";

// 認証の必要ないページのパス
const noAuthPaths = ["/login", "/sign-up"];
const authPaths = ["/matches", "/match/[id]"];

export async function middleware(req: NextRequest) {
  const start = Date.now();
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // 速度計測のため
  if (pathname === "/") {
    const end = Date.now();
    console.log(`[middleware] ${end - start}ms pathname: ${pathname}`);
    return res;
  }

  /**
   * @see https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
   */
  const supabase = createMiddlewareClient<Database>({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (noAuthPaths.some((path) => pathname.startsWith(path))) {
    const end = Date.now();
    console.log(`[middleware] ${end - start}ms pathname: ${pathname}`);
    return res;
  }

  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (!session) {
      const end = Date.now();
      console.log(`[middleware] ${end - start}ms pathname: ${pathname}`);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  const end = Date.now();
  console.log(`[middleware] ${end - start}ms pathname: ${pathname}`);
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
