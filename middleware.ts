import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import type { Database } from "~/lib/database.types";

const authRoutes = ["/signin", "/signup", "/redirect"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // If the request is for an auth route, return the response
  if (authRoutes.some((path) => pathname.startsWith(path))) {
    return res;
  }

  const supabase = createMiddlewareSupabaseClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // If the request is for the root path, redirect to the matches page
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/matches", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
