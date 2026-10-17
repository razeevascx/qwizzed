import { ProtectedPage } from "@/components/protected-page";
import { Suspense } from "react";
import ShareQuizClient from "./ShareQuizClient";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedPage quizParams={params}><Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          Loading share options...
        </div>
      }
    >
      <ShareQuizClient />
    </Suspense></ProtectedPage>
  );
}
