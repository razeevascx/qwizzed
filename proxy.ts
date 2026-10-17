import { NextResponse, type NextRequest } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

function routeRequest(request: NextRequest, isAuthenticated: boolean) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";
  const pathname = url.pathname;

  const isSubdomain = hostname.startsWith("app.");
  const isLocalhost =
    hostname.includes("localhost") || hostname.includes("127.0.0.1");

  // Handle CORS preflight requests
  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    const response = new NextResponse(null, { status: 204 });
    const origin = request.headers.get("origin");
    if (origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-client-info, apikey",
    );
    response.headers.set("Vary", "Origin");
    return response;
  }

  // Bypass API requests or handle them on their incoming domain
  if (pathname.startsWith("/api/")) {
    let response: NextResponse;

    // Rewrite /api/explore requests to /api/quiz internally to match folder structure
    if (pathname === "/api/explore" || pathname.startsWith("/api/explore/")) {
      const newPathname = pathname.replace(/^\/api\/explore/, "/api/quiz");
      const rewriteUrl = url.clone();
      rewriteUrl.pathname = newPathname;
      response = NextResponse.rewrite(rewriteUrl);
    } else {
      response = NextResponse.next({ request });
    }

    // Add CORS headers to all API responses to allow cross-origin requests between main domain and subdomain
    const origin = request.headers.get("origin");
    if (origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-client-info, apikey",
    );
    response.headers.set("Vary", "Origin");

    return response;
  }

  // Serve the custom Clerk flow on its incoming origin.
  if (pathname === "/get-started" || pathname.startsWith("/get-started/")) {
    return NextResponse.next({ request });
  }

  // Accept old quiz-taking URLs, keeping /take as the canonical route.
  const legacyTake = new RegExp(/^\/explore\/([^/]+)&action=take$/).exec(pathname);
  const queryTake = new RegExp(/^\/explore\/([^/]+)$/).exec(pathname);
  if (legacyTake || (queryTake && url.searchParams.get("action") === "take")) {
    url.pathname = `/explore/${legacyTake?.[1] || queryTake![1]}/take`;
    url.searchParams.delete("action");
    return NextResponse.redirect(url);
  }

  // Shared quiz links and legal pages also work on the app subdomain.
  if (pathname === "/explore" || pathname.startsWith("/explore/") ||
      ["/about", "/privacy", "/terms"].includes(pathname)) {
    return NextResponse.next({ request });
  }

  const hasAppPrefix = pathname === "/app" || pathname.startsWith("/app/");
  const isAppArea = isSubdomain || hasAppPrefix;

  if (isAppArea && !isAuthenticated) {
    const redirectUrl = new URL("/get-started", request.url);
    if (isSubdomain) redirectUrl.host = hostname.replace(/^app\./, "");
    const destination = hasAppPrefix ? pathname : pathname === "/" ? "/app" : `/app${pathname}`;
    redirectUrl.searchParams.set("next", destination + url.search);
    return NextResponse.redirect(redirectUrl);
  }

  // Handle mapping from url/app to app.url (subdomain)
  if (isSubdomain) {
    if (!hasAppPrefix) {
      url.pathname = `/app${pathname}`;
    }
    return NextResponse.rewrite(url);
  } else if (hasAppPrefix && !isLocalhost) {
    const newPathname = pathname.replace(/^\/app/, "") || "/";
    const newHost = `app.${hostname}`;

    const redirectUrl = url.clone();
    redirectUrl.pathname = newPathname;
    redirectUrl.host = newHost;

    const redirectResponse = NextResponse.redirect(redirectUrl);
    return redirectResponse;
  }

  return NextResponse.next({ request });
}

export default clerkMiddleware(async (auth, request) => routeRequest(request, (await auth()).isAuthenticated), {
  signInUrl: "/get-started",
});

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
    "/(api|trpc)(.*)",
  ],
};
