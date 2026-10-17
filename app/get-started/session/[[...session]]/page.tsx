import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";

export default function CompleteSessionPage() {
  return <Suspense fallback={<p role="status">Loading…</p>}><SignIn routing="path" path="/get-started/session" signUpUrl="/get-started/sign-up" /></Suspense>;
}
