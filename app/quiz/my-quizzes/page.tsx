"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { QuizCard } from "@/components/quiz-card";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/lib/types/quiz";
import { Plus } from "lucide-react";

export default function MyQuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/quizzes");
      if (!response.ok) throw new Error("Failed to load quizzes");
      const data = await response.json();
      setQuizzes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete quiz");
      setQuizzes(quizzes.filter((q) => q.id !== quizId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with gradient */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10 flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-3">
              My Quizzes
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Create, manage, and track your quiz collection. Edit existing
              quizzes or create new ones to engage your audience.
            </p>
          </div>
          <Button
            onClick={() => router.push("/quiz/create")}
            size="lg"
            className="gap-2 mt-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            New Quiz
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {error && (
          <div className="mb-8 p-6 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm">
            <div className="font-semibold mb-2">Error loading quizzes</div>
            <div className="text-destructive/90">{error}</div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-3">
              <p className="text-muted-foreground">Loading your quizzes...</p>
            </div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-6 p-12 rounded-2xl border border-border/50 bg-card/50 backdrop-blur max-w-md">
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-2">
                  <Plus className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold">No quizzes yet</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Get started by creating your first quiz. Build engaging
                  assessments to test your audience's knowledge.
                </p>
              </div>
              <Button
                onClick={() => router.push("/quiz/create")}
                size="lg"
                className="w-full"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Quiz
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8 space-y-2">
              <h2 className="text-3xl font-bold">
                {quizzes.length} {quizzes.length === 1 ? "Quiz" : "Quizzes"}
              </h2>
              <p className="text-muted-foreground">
                Manage and edit your quizzes below
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onDelete={handleDeleteQuiz}
                  showActions={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
