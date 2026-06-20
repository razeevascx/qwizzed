import { Suspense } from "react";
import EditQuizPage from "./EditQuizClient";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-6 text-muted-foreground">Loading...</div>}
    >
      <EditQuizPage />
    </Suspense>
  );
}
