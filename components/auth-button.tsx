import Link from "next/link";
import { Button } from "./ui/button";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight } from "lucide-react";
import { AuthenticatedAuthButton } from "@/components/authenticated-auth-button";

export async function AuthButton() {
  const { userId } = await auth();

  return userId ? <AuthenticatedAuthButton /> : (
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
