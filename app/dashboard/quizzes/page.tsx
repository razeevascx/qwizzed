"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { QuizCard } from "@/components/quiz-card";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/lib/types/quiz";
import { Plus } from "lucide-react";
import { QuizInviteDialog } from "@/components/quiz-invite-dialog";
import { PendingInvitations } from "@/components/pending-invitations";

export default function MyQuizzesPage() {
  const router = useRouter();
  type OwnedOrInvitedQuiz = Quiz & {
    accessType?: "owner" | "invited";
    invitationStatus?: "pending" | "accepted" | "declined";
  };

  const [quizzes, setQuizzes] = useState<OwnedOrInvitedQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuizForInvite, setSelectedQuizForInvite] = useState<
    string | null
  >(null);

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
    <div className="min-h-screen  text-foreground">
      {/* Header */}
      <div className="space-y-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              My Quizzes
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Create, manage, and track your quiz collection. Edit existing
              quizzes or create new ones to engage your audience.
            </p>
          </div>
        </div>
      </div>
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
          <div className="font-semibold mb-2">Error loading quizzes</div>
          <div className="text-destructive/90">{error}</div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <p className="text-muted-foreground">Loading your quizzes...</p>
          </div>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="flex items-center justify-center py-32 min-h-[60vh]">
          <div className="text-center space-y-8 max-w-md">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                  <Plus className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Create your first quiz</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Start building engaging quizzes to test your audience's
                  knowledge and track their progress.
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/create")}
              size="lg"
              className="w-full gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Quiz
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Your Quizzes</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {quizzes.length} {quizzes.length === 1 ? "quiz" : "quizzes"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onDelete={
                  quiz.accessType !== "invited" ? handleDeleteQuiz : undefined
                }
                onInvite={
                  quiz.accessType !== "invited"
                    ? setSelectedQuizForInvite
                    : undefined
                }
                showActions={true}
                accessType={quiz.accessType}
                invitationStatus={quiz.invitationStatus}
              />
            ))}
          </div>
        </>
      )}

      {/* Invite Dialog */}
      {selectedQuizForInvite && (
        <QuizInviteDialog
          quizId={selectedQuizForInvite}
          onClose={() => setSelectedQuizForInvite(null)}
          onInviteSent={() => {
            // Optionally refresh invitations or show success message
          }}
        />
      )}
    </div>
  );
}
