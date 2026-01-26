import type { ReactNode } from "react";
import { Suspense } from "react";
import { Sidebar } from "@/components/Sidebar";
import Layout from "@/components/layout/Layout";

export default function QuizLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-linear-to-br from-background via-background to-muted/30 text-foreground">
      <aside className="sticky top-6 self-start h-dvh" aria-label="Sidebar">
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>
      </aside>

      <main className="w-full" role="main" aria-label="Quiz content">
        <Layout className="py-8">{children}</Layout>
      </main>
    </div>
  );
}
