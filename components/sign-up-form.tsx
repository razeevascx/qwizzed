"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Loader2, Check, Mail, Lock } from "lucide-react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const passwordsMatch = password === repeatPassword && password.length > 0;
  const passwordLongEnough = password.length >= 8;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/get-started/confirm?next=/quiz`,
        },
      });
      if (error) throw error;
      router.push("/get-started/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <form onSubmit={handleSignUp} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-xl animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2.5">
          <Label htmlFor="email" className="text-sm font-semibold">
            Email address
          </Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-11 pl-11 pr-4 bg-background/50 border border-border/60 rounded-lg hover:border-border/80 focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2.5">
          <Label htmlFor="password" className="text-sm font-semibold">
            Password
          </Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="h-11 pl-11 pr-4 bg-background/50 border border-border/60 rounded-lg hover:border-border/80 focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          {password.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              {passwordLongEnough ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-border"></div>
              )}
              <span
                className={
                  passwordLongEnough
                    ? "text-emerald-600 font-medium"
                    : "text-muted-foreground"
                }
              >
                At least 8 characters
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2.5">
          <Label htmlFor="repeat-password" className="text-sm font-semibold">
            Confirm password
          </Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="repeat-password"
              type="password"
              placeholder="Repeat your password"
              required
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              disabled={isLoading}
              className="h-11 pl-11 pr-4 bg-background/50 border border-border/60 rounded-lg hover:border-border/80 focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          {repeatPassword.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              {passwordsMatch ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-destructive" />
              )}
              <span
                className={
                  passwordsMatch
                    ? "text-emerald-600 font-medium"
                    : "text-destructive font-medium"
                }
              >
                {passwordsMatch ? "Passwords match" : "Passwords don't match"}
              </span>
            </div>
          )}
        </div>

        {/* Sign Up Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full h-11 mt-8 bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/25 text-primary-foreground font-semibold rounded-lg transition-all duration-200 group"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create free account"
          )}
        </Button>

        {/* Divider */}
        <div className="relative py-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/30" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Already have an account?
            </span>
          </div>
        </div>

        {/* Sign In Link */}
        <Link href="/get-started" className="block">
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="w-full h-11 border border-border/60 hover:border-border/80 hover:bg-muted/40 font-semibold rounded-lg transition-all"
          >
            Sign in instead
          </Button>
        </Link>
      </form>
    </div>
  );
}
