import { Suspense } from "react";
import ShareQuizClient from "./ShareQuizClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          Loading share options...
        </div>
      }
    >
      <ShareQuizClient />
    </Suspense>
  );
}
