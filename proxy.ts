import { NextResponse, type NextRequest } from "next/server";
import { getSessionUser } from "@/lib/supabase/middleware";

function isPublicQuizApi(pathname: string, method: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length < 3 || parts[0] !== "api" || parts[1] !== "quiz") {
    return false;
  }

  if (parts.length === 3) {
    return method === "GET";
  }

  if (parts.length === 4) {
    if (parts[3] === "leaderboard") {
      return method === "GET";
    }
    if (parts[3] === "submissions") {
      return method === "POST";
    }
  }

  if (parts.length === 5 && parts[3] === "submissions") {
    return method === "POST";
  }

  return false;
}

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";
  const pathname = url.pathname;

  const isSubdomain = hostname.startsWith("app.");

  // Handle CORS preflight requests
  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    const response = new NextResponse(null, { status: 204 });
    const origin = request.headers.get("origin");
    if (origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-client-info, apikey");
    response.headers.set("Vary", "Origin");
    return response;
  }

  // Bypass API requests or handle them on their incoming domain
  if (pathname.startsWith("/api/")) {
    let response: NextResponse;

    // Rewrite /api/explore requests to /api/quiz internally to match folder structure
    if (pathname.startsWith("/api/explore")) {
      const newPathname = pathname.replace(/^\/api\/explore/, "/api/quiz");
      const rewriteUrl = new URL(newPathname, request.url);
      response = NextResponse.rewrite(rewriteUrl);
    } else {
      response = NextResponse.next({ request });
    }

    const authResult = await getSessionUser(request);
    if (authResult?.response) {
      for (const cookie of authResult.response.cookies.getAll()) {
        response.cookies.set(cookie.name, cookie.value);
      }
    }

    // Add CORS headers to all API responses to allow cross-origin requests between main domain and subdomain
    const origin = request.headers.get("origin");
    if (origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-client-info, apikey");
    response.headers.set("Vary", "Origin");

    return response;
  }

  const isAuthRoute = pathname.startsWith("/get-started");

  // Redirect any auth routes on the subdomain to the main domain
  if (isSubdomain && isAuthRoute) {
    const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");
    if (!isLocalhost) {
      const mainHost = hostname.replace(/^app\./, "");
      const redirectUrl = new URL(pathname, request.url);
      redirectUrl.host = mainHost;
      return NextResponse.redirect(redirectUrl);
    }
    // On localhost, fall through and let the auth route be served
    // directly on the subdomain (handled in the rewrite block below).
  }

  // 1. Redirect /explore/[id]/take to /explore/[id]&action=take
  const exploreTakeMatch = pathname.match(/^\/explore\/([^/]+)\/take$/);
  if (exploreTakeMatch) {
    const id = exploreTakeMatch[1];
    const redirectUrl = new URL(`/explore/${id}&action=take`, request.url);
    redirectUrl.host = hostname;
    return NextResponse.redirect(redirectUrl);
  }

  const isAppArea = isSubdomain || pathname.startsWith("/app");

  // Get Supabase user and updated response (with any refreshed cookies)
  const authResult = await getSessionUser(request);
  const user = authResult?.user;
  const supabaseResponse = authResult?.response ?? NextResponse.next({ request });

  if (isAppArea && !isAuthRoute) {
    if (!user) {
      const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");
      if (isLocalhost) {
        // Redirect unauthenticated user to /get-started on the subdomain itself
        const redirectUrl = new URL("/get-started", request.url);
        redirectUrl.host = hostname;
        return NextResponse.redirect(redirectUrl);
      } else {
        // Redirect unauthenticated user to /get-started on the main domain
        const mainHost = hostname.replace(/^app\./, "");
        const redirectUrl = new URL("/get-started", request.url);
        redirectUrl.host = mainHost;
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  // 2. Rewrite /explore/[id]&action=take or /explore/[id]?action=take to /explore/[id]/take
  const hasTakeAction = pathname.endsWith("&action=take") || url.searchParams.get("action") === "take";
  if (hasTakeAction && pathname.startsWith("/explore/")) {
    let id = pathname.replace(/^\/explore\//, "");
    if (id.endsWith("&action=take")) {
      id = id.substring(0, id.length - 12);
    }
    url.pathname = `/explore/${id}/take`;
    const rewriteResponse = NextResponse.rewrite(url);
    for (const cookie of supabaseResponse.cookies.getAll()) {
      rewriteResponse.cookies.set(cookie.name, cookie.value);
    }
    return rewriteResponse;
  }

  // Handle mapping from url/app to app.url (subdomain)
  if (isSubdomain) {
    // Auth routes (e.g. /get-started) stay at the root path on the subdomain
    // instead of being rewritten to /app/get-started, otherwise Next.js has
    // no matching page and returns a 404.
    if (!isAuthRoute && !pathname.startsWith("/app")) {
      url.pathname = `/app${pathname}`;
    }
    const rewriteResponse = NextResponse.rewrite(url);
    for (const cookie of supabaseResponse.cookies.getAll()) {
      rewriteResponse.cookies.set(cookie.name, cookie.value);
    }
    return rewriteResponse;
  } else if (pathname.startsWith("/app")) {
    const newPathname = pathname.replace(/^\/app/, "") || "/";
    const newHost = `app.${hostname}`;

    const redirectUrl = new URL(newPathname, request.url);
    redirectUrl.host = newHost;

    const redirectResponse = NextResponse.redirect(redirectUrl);
    for (const cookie of supabaseResponse.cookies.getAll()) {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    }
    return redirectResponse;
  }

  return supabaseResponse;
}

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