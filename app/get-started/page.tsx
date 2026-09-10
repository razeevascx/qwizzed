import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to Qwizzed and start creating and taking interactive quizzes.",
};

export default function Page() {
  return (
    <div className="w-full h-full  px-4 sm:px-8">
      <div className="w-full max-w-xl space-y-8">
        {/* Header */}
        <div className="space-y-2">


          <h1 className="text-5xl font-bold ">
            Turn your knowledge  into interactive experiences.
          </h1>
          <p className="text-zinc-400 max-w-screen">
            Join thousands of creators using Qwizzed to engage their audience
            and track learning progress with ease.
          </p>
        </div>

        {/* Form */}
        <div className="pt-4">
          <Suspense
            fallback={
              <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
            }
          >
            <LoginForm />
          </Suspense>
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
