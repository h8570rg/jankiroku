import { type NextRequest } from "next/server";
import { updateSession } from "./lib/utils/supabase/middleware";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noAuthRoutes = [
  "/auth-code-error",
  "/login",
  "/sign-up",
  "/api/auth/callback",
  "/manifest.json", // TODO: 見直し
];

/**
 * @see https://supabase.com/docs/guides/auth/server-side/creating-a-client?environment=middleware
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
  // return NextResponse.next({
  //   request: {
  //     headers: request.headers,
  //   },
  // });

  // パフォーマンス検証のためコメントアウト
  /** @see https://github.com/orgs/supabase/discussions/20905 */
}

/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
