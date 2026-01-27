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
      redirect(next);
    } else {
      redirect(
        `/get-started/error?error=${encodeURIComponent(error?.message)}`,
      );
    }
  }

  redirect(`/get-started/error?error=No token hash, code, or type`);
}
