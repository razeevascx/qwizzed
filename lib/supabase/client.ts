import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  let domain: string | undefined = undefined;
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");

    if (hostname.includes("127.0.0.1")) {
      // 127.0.0.1 has no subdomain concept — leave cookies host-only.
      domain = undefined;
    } else if (isLocalhost) {
      // localhost / app.localhost — scope to ".localhost" so the cookie set
      // during login is shared across both. Modern browsers support
      // *.localhost natively.
      domain = ".localhost";
    } else {
      // Production — scope to the root domain so app.example.com shares
      // cookies with example.com.
      domain = hostname.startsWith("app.") ? hostname.substring(4) : hostname;
    }
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookieOptions: domain ? { domain } : undefined,
    }
  );
}