"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  AlertCircle,
  Loader2,
  Mail,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleMagicLinkLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    setEmailSent(false);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/get-started/callback?next=/quiz`,
        },
      });

      if (error) throw error;

      setEmailSent(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    setError(null);
    setIsGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/get-started/callback?next=/quiz`,
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <form onSubmit={handleMagicLinkLogin} className="space-y-6">
        {/* Success Alert */}
        {emailSent && (
          <div className="flex items-start gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                Magic link sent!
              </p>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                Check your email for a link to sign in to Qwizzed
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-xl animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Google OAuth */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full h-11 border border-border/60 hover:border-border/80 hover:bg-muted/40 font-semibold rounded-lg transition-all"
          onClick={handleGoogleLogin}
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting...
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-gradient-to-br from-[#4285F4] via-[#34A853] to-[#FBBC05] text-[10px] font-black text-white">
                G
              </span>
              <span>Sign in with Google</span>
            </div>
          )}
        </Button>

        {/* OAuth Divider */}
        <div className="relative py-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/30" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2.5">
          <Label htmlFor="email" className="text-sm font-semibold">
            Email address
          </Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              disabled={isLoading || emailSent}
              className="h-11 pl-11 pr-4 bg-background/50 border border-border/60 rounded-lg hover:border-border/80 focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            We'll send you a magic link to sign in without a password
          </p>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full h-11 mt-8 bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/25 text-primary-foreground font-semibold rounded-lg transition-all duration-200 group"
          disabled={isLoading || emailSent}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending magic link...
            </>
          ) : emailSent ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Email sent - Check your inbox
            </>
          ) : (
            <>
              Send magic link
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
