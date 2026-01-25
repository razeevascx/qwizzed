import { Suspense } from "react";
import TakeQuizClient from "./TakeQuizClient";

export default function TakeQuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          Loading quiz...
        </div>
      }
    >
      <TakeQuizClient />
    </Suspense>
  );
}
