"use client";

import { useEffect, useMemo, useState } from "react";
import { Quiz } from "@/lib/types/quiz";
import { QuizCard } from "@/components/quiz-card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Sparkles, BookOpen, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadInvitedQuizzes = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const invitationsResponse = await fetch("/api/invitations");
        if (!invitationsResponse.ok) {
          console.log("No invitations or error:", invitationsResponse.status);
          return;
        }

        const invitations = await invitationsResponse.json();

        if (!Array.isArray(invitations) || invitations.length === 0) {
          console.log("No invitations found");
          return;
        }

        const quizPromises = invitations.map(
          async (inv: { quiz_id: string }) => {
            try {
              const quizResponse = await fetch(`/api/quiz/${inv.quiz_id}`);
              if (quizResponse.ok) {
                const quiz = await quizResponse.json();
                if (!quiz || !quiz.id || !quiz.slug) {
                  console.error("Invalid quiz data from API:", quiz);
                  return null;
                }
                return { ...quiz, isInvited: true } as QuizWithInvite;
              }
            } catch (err) {
              console.error("Failed to fetch quiz:", inv.quiz_id, err);
            }
            return null;
          },
        );

        const invitedQuizzes = (await Promise.all(quizPromises)).filter(
          (quiz): quiz is QuizWithInvite =>
            quiz !== null && quiz.id !== undefined,
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

  const filteredPublicQuizzes = useMemo(() => {
    if (!searchQuery.trim()) return publicQuizzes;
    const query = searchQuery.toLowerCase();
    return publicQuizzes.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(query) ||
        quiz.description?.toLowerCase().includes(query),
    );
  }, [publicQuizzes, searchQuery]);

  const filteredInvitedQuizzes = useMemo(() => {
    if (!searchQuery.trim()) return invitedQuizzes;
    const query = searchQuery.toLowerCase();
    return invitedQuizzes.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(query) ||
        quiz.description?.toLowerCase().includes(query),
    );
  }, [invitedQuizzes, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Explore Quizzes
              </h1>
              <p className="text-muted-foreground">
                Discover and take quizzes from our community
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <Button
                  onClick={() => router.push("/dashboard/quizzes")}
                  variant="outline"
                  className="h-10"
                >
                  My Quizzes
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="animate-pulse flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
                  <BookOpen className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
              <p className="text-muted-foreground">Loading quizzes...</p>
            </div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-4 p-8 rounded-xl border border-border bg-card">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-muted">
                  <Sparkles className="w-7 h-7 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-foreground">
                  No quizzes available yet
                </h2>
                <p className="text-muted-foreground">
                  New quizzes coming soon. Check back later!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {user && filteredInvitedQuizzes.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Invited Quizzes
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Private quizzes you&apos;ve been invited to
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {filteredInvitedQuizzes.length}{" "}
                    {filteredInvitedQuizzes.length === 1 ? "quiz" : "quizzes"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredInvitedQuizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} showActions={false} />
                  ))}
                </div>
              </section>
            )}

            {filteredPublicQuizzes.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Public Quizzes
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Open to everyone
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {filteredPublicQuizzes.length}{" "}
                    {filteredPublicQuizzes.length === 1 ? "quiz" : "quizzes"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPublicQuizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} showActions={false} />
                  ))}
                </div>
              </section>
            )}

            {filteredPublicQuizzes.length === 0 &&
              filteredInvitedQuizzes.length === 0 &&
              searchQuery && (
                <div className="flex items-center justify-center py-24">
                  <div className="text-center space-y-4 p-8 rounded-xl border border-border bg-card">
                    <div className="flex justify-center">
                      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-muted">
                        <Search className="w-7 h-7 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-foreground">
                        No results found
                      </h2>
                      <p className="text-muted-foreground">
                        Try a different search term
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {filteredPublicQuizzes.length === 0 &&
              filteredInvitedQuizzes.length === 0 &&
              !searchQuery && (
                <div className="flex items-center justify-center py-24">
                  <div className="text-center space-y-4 p-8 rounded-xl border border-border bg-card">
                    <div className="flex justify-center">
                      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-muted">
                        <Sparkles className="w-7 h-7 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-foreground">
                        No quizzes available yet
                      </h2>
                      <p className="text-muted-foreground">
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
  );
}
