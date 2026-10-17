"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VerifyEmail() {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const searchParams = useSearchParams();
  const verification = searchParams.get("flow") === "sign-up"
    ? signUp.verifications.emailLinkVerification
    : signIn.emailLink.verification;

  const messages = {
    verified: "Your email is verified. Return to the tab where you started signing in to continue.",
    expired: "This email link has expired. Request a new one to continue.",
    failed: "We could not verify this email link. Please try again.",
    client_mismatch: "Open this link in the same browser and device where you requested it.",
  };

  return (
    <div className="w-full max-w-xl space-y-6 px-4 sm:px-8">
      <h1 className="text-4xl font-bold">Verify your email</h1>
      <p role="status" className="text-muted-foreground">
        {verification ? messages[verification.status] : "Verifying your email link…"}
      </p>
      <Link href="/get-started" className="underline">Back to sign in</Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return <Suspense fallback={<p role="status">Verifying your email link…</p>}><VerifyEmail /></Suspense>;
}
