import { ProtectedPage } from "@/components/protected-page";
import { Suspense } from "react";
import EditQuizPage from "./EditQuizClient";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedPage quizParams={params}><Suspense
      fallback={<div className="p-6 text-muted-foreground">Loading...</div>}
    >
      <EditQuizPage />
    </Suspense></ProtectedPage>
  );
}
