"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuizCard } from "@/components/quiz-card";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/lib/types/quiz";
import { Plus } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function MyQuizzesPage() {
  const router = useRouter();
  type OwnedOrInvitedQuiz = Quiz & {
    accessType?: "owner" | "invited";
    invitationStatus?: "pending" | "accepted" | "declined";
  };

  const [quizzes, setQuizzes] = useState<OwnedOrInvitedQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/quiz");
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
      const response = await fetch(`/api/quiz/${quizId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete quiz");
      setQuizzes(quizzes.filter((q) => q.id !== quizId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-foreground">
                My Quizzes
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">My Quizzes</h1>
          <p className="text-muted-foreground max-w-2xl">
            Create, manage, and track your quiz collection. Edit existing
            quizzes or create new ones to engage your audience.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/create")}
          size="sm"
          className="h-9 gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Quiz
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/5 border border-destructive/20 rounded-lg text-destructive text-sm">
          <div className="font-medium">Error loading quizzes</div>
          <div className="mt-1 text-destructive/80">{error}</div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center py-12">
          <p className="text-muted-foreground">Loading your quizzes...</p>
        </div>
      ) : quizzes.length === 0 ? (
        // Empty State
        <div className="py-24 border border-dashed rounded-lg bg-muted/30">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-6 mx-auto">
              <Plus className="w-8 h-8 text-primary" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold mb-3">Create your first quiz</h2>
            <p className="text-muted-foreground mb-8 max-w-prose mx-auto">
              Start building engaging quizzes to test your audience's knowledge
              and track their progress.
            </p>
            <Button
              onClick={() => router.push("/dashboard/create")}
              size="lg"
              className="gap-2 px-8"
            >
              <Plus className="w-4 h-4" />
              Create Quiz
            </Button>
          </div>
        </div>
      ) : (
        // Quiz Grid
        <>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-semibold">Your Quizzes</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {quizzes.length} {quizzes.length === 1 ? "quiz" : "quizzes"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onDelete={() => handleDeleteQuiz(quiz.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
