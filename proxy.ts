import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/utils/supabase/middleware";

/**
 * @see https://supabase.com/docs/guides/auth/server-side/creating-a-client?environment=middleware
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function proxy(request: NextRequest) {
	if (request.nextUrl.pathname === "/") {
		return NextResponse.next();
	}

	if (process.env.MAINTENANCE_MODE !== "true") {
		if (request.nextUrl.pathname === "/maintenance") {
			return NextResponse.rewrite(new URL("/404", request.url));
		}
	} else {
		return NextResponse.rewrite(new URL("/maintenance", request.url));
	}

	/** @see https://github.com/orgs/supabase/discussions/20905 */
	return await updateSession(request);
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
		"/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
