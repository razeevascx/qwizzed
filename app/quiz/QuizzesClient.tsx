"use client";

import { useEffect, useMemo, useState } from "react";
import { Quiz } from "@/lib/types/quiz";
import { QuizCard } from "@/components/quiz-card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Sparkles, BookOpen, Zap } from "lucide-react";

type QuizWithInvite = Quiz & { isInvited?: boolean };

interface QuizzesClientProps {
  initialPublicQuizzes: Quiz[];
  user: { id: string; email?: string | null } | null;
}

export default function QuizzesClient({
  initialPublicQuizzes,
  user,
}: QuizzesClientProps) {
  const router = useRouter();
  const [quizzes, setQuizzes] =
    useState<QuizWithInvite[]>(initialPublicQuizzes);
  const [isLoading, setIsLoading] = useState(
    initialPublicQuizzes.length === 0 && !!user,
  );

  useEffect(() => {
    let isMounted = true;

    const loadInvitedQuizzes = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const invitationsResponse = await fetch("/api/invitations");
        if (!invitationsResponse.ok) return;

        const invitations = await invitationsResponse.json();
        const quizPromises = invitations.map(
          async (inv: { quiz_id: string }) => {
            const quizResponse = await fetch(`/api/quiz/${inv.quiz_id}`);
            if (quizResponse.ok) {
              const quiz = await quizResponse.json();
              return { ...quiz, isInvited: true } as QuizWithInvite;
            }
            return null;
          },
        );

        const invitedQuizzes = (await Promise.all(quizPromises)).filter(
          (quiz): quiz is QuizWithInvite => quiz !== null,
        );

        if (!isMounted) return;

        const allQuizzes = [...initialPublicQuizzes, ...invitedQuizzes];
        const uniqueQuizzes = allQuizzes.filter(
          (quiz, index, self) =>
            index === self.findIndex((q) => q.id === quiz.id),
        );

        setQuizzes(uniqueQuizzes);
      } catch (err) {
        console.error("Failed to load invitations:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadInvitedQuizzes();

    return () => {
      isMounted = false;
    };
  }, [initialPublicQuizzes, user]);

  const publicQuizzes = useMemo(
    () => quizzes.filter((q) => !q.isInvited),
    [quizzes],
  );
  const invitedQuizzes = useMemo(
    () => quizzes.filter((q) => q.isInvited),
    [quizzes],
  );

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <div className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20 relative z-10">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  Test Your Knowledge
                </div>
                <h1 className="text-5xl sm:text-6xl font-bold mb-3 tracking-tight">
                  Available Quizzes
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl">
                  Challenge yourself with our curated collection of quizzes.
                  Choose from various difficulty levels and topics.
                </p>
              </div>
              {user && (
                <Button
                  onClick={() => router.push("/dashboard/quizzes")}
                  variant="outline"
                  className="mt-4 sm:mt-0"
                  size="lg"
                >
                  My Quizzes
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="animate-pulse flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10">
                    <BookOpen className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <p className="text-lg text-muted-foreground">
                  Loading quizzes...
                </p>
              </div>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center space-y-4 p-12 rounded-xl border border-border/50 bg-card/50 backdrop-blur">
                <div className="flex justify-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">
                    No quizzes available yet
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    New quizzes coming soon. Check back later!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {user && invitedQuizzes.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-2">Invited Quizzes</h2>
                    <p className="text-muted-foreground">
                      Private quizzes you&apos;ve been invited to
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                    {invitedQuizzes.map((quiz) => (
                      <QuizCard key={quiz.id} quiz={quiz} showActions={false} />
                    ))}
                  </div>
                </div>
              )}

              {publicQuizzes.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-2">
                      Public Quizzes
                      <span className="ml-3 text-lg font-normal text-muted-foreground">
                        {publicQuizzes.length}{" "}
                        {publicQuizzes.length === 1 ? "quiz" : "quizzes"}
                      </span>
                    </h2>
                    <p className="text-muted-foreground">
                      Open to everyone - test your knowledge!
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                    {publicQuizzes.map((quiz) => (
                      <QuizCard key={quiz.id} quiz={quiz} showActions={false} />
                    ))}
                  </div>
                </div>
              )}

              {publicQuizzes.length === 0 && invitedQuizzes.length === 0 && (
                <div className="flex items-center justify-center py-24">
                  <div className="text-center space-y-4 p-12 rounded-xl border border-border/50 bg-card/50 backdrop-blur">
                    <div className="flex justify-center">
                      <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10">
                        <Sparkles className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">
                        No quizzes available yet
                      </h2>
                      <p className="text-muted-foreground text-lg">
                        New quizzes coming soon. Check back later!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
