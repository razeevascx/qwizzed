import type { ReactNode } from "react";
import { Suspense } from "react";
import { Sidebar } from "@/components/Sidebar";

export default function QuizLayout({ children }: { children: ReactNode }) {
  return (
    <div className=" flex bg-gradient-to-br from-background via-background to-muted/30 text-foreground">
      <aside className="sticky top-6 self-start" aria-label="Sidebar">
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>
      </aside>

      {/* render content card directly in the right column */}
      <main className="w-full " role="main" aria-label="Quiz content">
        {children}
      </main>
    </div>
  );
}
