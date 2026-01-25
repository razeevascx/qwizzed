import { Suspense } from "react";
import { EditQuizClient } from "./EditQuizClient";

export default function EditQuizPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      }
    >
      <EditQuizClient quizId={id} />
    </Suspense>
  );
}
