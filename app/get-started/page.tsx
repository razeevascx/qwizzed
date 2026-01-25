import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to Qwizzed and start creating and taking interactive quizzes.",
};

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 sm:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-5xl sm:text-6xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-lg text-muted-foreground max-w-sm">
            Sign in and unlock your quiz creation superpowers
          </p>
        </div>

        {/* Form */}
        <div className="pt-4">
          <LoginForm />
        </div>

        {/* Terms */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          By continuing, you agree to{" "}
          <Link
            href="/terms"
            className="underline hover:text-foreground transition-colors"
          >
            Qwizzed&apos;s Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          , and to receive periodic emails with updates.
        </p>
      </div>
    </div>
  );
}
