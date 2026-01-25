import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/get-started/login");
  }

  return (
    <div className="flex h-svh w-full items-center justify-center gap-2 bg-background text-foreground">
      <p>
        Hello <span>{data.claims.email}</span>
      </p>
      <LogoutButton />
    </div>
  );
}
