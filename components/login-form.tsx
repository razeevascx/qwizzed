"use client";

import { cn } from "@/lib/utils";
import { authRedirect } from "@/lib/auth-redirect";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  Loader2,
  Mail,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Google } from "./Icons/Google";

export function LoginForm({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const router = useRouter();
  const { signIn, fetchStatus: signInStatus } = useSignIn();
  const { signUp, fetchStatus: signUpStatus } = useSignUp();
  const searchParams = useSearchParams();
  const destination = authRedirect(searchParams?.get("next") || searchParams?.get("redirect"));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const busy = isLoading || isGoogleLoading || signInStatus === "fetching" || signUpStatus === "fetching";

  const navigate: NonNullable<Parameters<typeof signIn.finalize>[0]>["navigate"] = ({ session, decorateUrl }) => {
    const url = decorateUrl(session.currentTask ? "/get-started/session" : destination);
    if (url.startsWith("http")) globalThis.location.assign(url);
    else router.push(url);
  };

  function showError(error: unknown) {
    if (isClerkAPIResponseError(error)) {
      setError(error.errors[0]?.longMessage || error.errors[0]?.message || "Unable to sign in. Please try again.");
    } else {
      setError(error instanceof Error ? error.message : "Unable to sign in. Please try again.");
    }
    setEmailSent(false);
  }

  const handleMagicLinkLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setEmailSent(false);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const verificationUrl = new URL("/get-started/verify", globalThis.location.origin);
      let flow: "sign-in" | "sign-up" = "sign-in";
      const result = await signIn.emailLink.sendLink({
        emailAddress: email,
        verificationUrl: verificationUrl.href,
      });
      if (result.error) {
        const notFound = isClerkAPIResponseError(result.error) &&
          result.error.errors.some((error) => error.code === "form_identifier_not_found");
        if (!notFound) throw result.error;
        flow = "sign-up";
        const created = await signUp.create({ emailAddress: email });
        if (created.error) throw created.error;
        verificationUrl.searchParams.set("flow", "sign-up");
        const sent = await signUp.verifications.sendEmailLink({ verificationUrl: verificationUrl.href });
        if (sent.error) throw sent.error;
      }
      setEmailSent(true);
      setIsLoading(false);
      const verified = flow === "sign-in"
        ? await signIn.emailLink.waitForVerification()
        : await signUp.verifications.waitForEmailLinkVerification();
      if (verified.error) throw verified.error;

      if (flow === "sign-in" && signIn.status === "complete") {
        const finalized = await signIn.finalize({ navigate });
        if (finalized.error) throw finalized.error;
      } else if (flow === "sign-up" && signUp.status === "complete") {
        const finalized = await signUp.finalize({ navigate });
        if (finalized.error) throw finalized.error;
      } else {
        router.push(flow === "sign-in" ? "/get-started/session" : "/get-started/sign-up");
      }
    } catch (error: unknown) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);

    try {
      const { error } = await signIn.sso({
        strategy: "oauth_google",
        redirectCallbackUrl: "/get-started/sso-callback",
        redirectUrl: destination,
      });

      if (error) throw error;
    } catch (err: unknown) {
      showError(err);
    } finally {
      setIsGoogleLoading(false);

    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <form onSubmit={handleMagicLinkLogin} className="space-y-6">
        {/* Success Alert */}
        {emailSent && (
          <div className="flex items-start gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
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
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
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
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              disabled={busy || emailSent}
              className="h-11 pl-11 pr-4 bg-background/50 border border-border/60 rounded-lg hover:border-border/80 focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            We&apos;ll send you a magic link to sign in without a password
          </p>
        </div>

        {/* Google OAuth */}
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full h-11 border border-border font-semibold rounded-lg transition-all hover:text-primary "
          onClick={handleGoogleLogin}
          disabled={busy || emailSent}
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting...
            </>
          ) : (
            <div className="flex items-center gap-2 ">
              <Google className="w-4 h-4" />
              <span>Sign in with Google</span>
            </div>
          )}
        </Button>
        {/* Sign In Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full h-11 mt-8 bg-linear-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/25 text-primary-foreground font-semibold rounded-lg transition-all duration-200 group"
          disabled={busy || emailSent}
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
      <div id="clerk-captcha" />
    </div>
  );
}
