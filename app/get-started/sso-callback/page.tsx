"use client";

import { Suspense } from "react";
import { HandleSSOCallback } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function SSOCallback() {
  const router = useRouter();

  return (
    <HandleSSOCallback
      navigateToApp={({ session, decorateUrl }) => {
        const url = decorateUrl(session.currentTask ? "/get-started/session" : "/explore");
        if (url.startsWith("http")) globalThis.location.assign(url);
        else router.replace(url);
      }}
      navigateToSignIn={() => router.replace("/get-started/session")}
      navigateToSignUp={() => router.replace("/get-started/sign-up")}
    />
  );
}

export default function SSOCallbackPage() {
  return <Suspense fallback={<p role="status">Completing sign in…</p>}><SSOCallback /></Suspense>;
}
