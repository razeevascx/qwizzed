import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/quiz";

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successfully exchanged code for session
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      // Failed to exchange code
      return NextResponse.redirect(
        `${origin}/get-started/error?error=${encodeURIComponent(error.message)}`,
      );
    }
  }

  // No code provided, redirect to login page
  return NextResponse.redirect(`${origin}/get-started`);
}
