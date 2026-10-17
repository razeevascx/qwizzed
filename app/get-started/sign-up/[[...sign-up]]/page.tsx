import { Suspense } from "react";
import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Qwizzed account.",
};

export default function SignUpPage() {
  return <Suspense fallback={<p role="status">Loading…</p>}><SignUp routing="path" path="/get-started/sign-up" signInUrl="/get-started" /></Suspense>;
}
