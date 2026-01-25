import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const code = searchParams.get("code");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/quiz";

  if ((token_hash || code) && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: token_hash || code || "",
    });
    if (!error) {
      // redirect user to specified redirect URL or protected
      redirect(next);
    } else {
      // redirect the user to an error page with some instructions
      redirect(
        `/get-started/error?error=${encodeURIComponent(error?.message)}`,
      );
    }
  }

  // redirect the user to an error page with some instructions
  redirect(`/get-started/error?error=No token hash, code, or type`);
}
