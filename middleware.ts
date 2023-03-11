import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import type { Database } from "~/lib/database.types";

const authRoutes = ["/signin", "/signup"];

export async function middleware(req: NextRequest) {
  if (!authRoutes.some((path) => req.nextUrl.pathname.startsWith(path))) {
    const res = NextResponse.next();
    const supabase = createMiddlewareSupabaseClient<Database>({ req, res });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    return res;
  }
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
