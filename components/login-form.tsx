"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Loader2, Mail, Lock, ArrowRight } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/protected");
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <form onSubmit={handleLogin} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2.5">
          <Label htmlFor="email" className="text-sm font-semibold">
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={isLoading}
              className="h-11 pl-10 bg-background border border-border/50 focus:border-primary"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-semibold">
              Password
            </Label>
            <Link
              href="/get-started/forgot-password"
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="h-11 pl-10 bg-background border border-border/50 focus:border-primary"
            />
          </div>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          className="w-full h-11 mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-xs text-muted-foreground font-medium">
              New to Qwizzed?
            </span>
          </div>
        </div>

        {/* Sign Up Button */}
        <Link href="/auth/sign-up" className="block">
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border border-border/50 hover:bg-muted/50 font-semibold"
          >
            Create an account
          </Button>
        </Link>
      </form>
    </div>
  );
}
