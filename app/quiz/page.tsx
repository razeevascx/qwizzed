import { Suspense } from "react";
import QuizzesDataLoader from "./[id]/QuizzesDataLoader";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

function QuizzesLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-pulse flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 mx-auto">
          <div className="w-7 h-7 bg-primary/20 rounded" />
        </div>
        <p className="text-lg text-muted-foreground">Loading quizzes...</p>
      </div>
    </div>
  );
}

export default function QuizzesPage() {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<QuizzesLoadingSkeleton />}>
        <QuizzesDataLoader />
      </Suspense>
      <SiteFooter />
    </>
  );
}
