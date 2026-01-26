import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight } from "lucide-react";
import { CurrentUserAvatar } from "./current-user-avatar";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <div className="flex items-center gap-3">
      <Button asChild size="sm" variant="default" className="gap-1.5">
        <Link href="/quiz" className="flex items-center gap-1.5">
          Go to dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
      <CurrentUserAvatar />
    </div>
  ) : (
    <Button
      asChild
      size="sm"
      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm group"
    >
      <Link href="/get-started" className="flex items-center gap-1.5">
        Get Started
        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </Button>
  );
}
