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
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

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
    let result = publicQuizzes;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(query) ||
          quiz.description?.toLowerCase().includes(query),
      );
    }
    if (selectedDifficulty) {
      result = result.filter((quiz) => quiz.difficulty_level === selectedDifficulty);
    }
    return result;
  }, [publicQuizzes, searchQuery, selectedDifficulty]);

  const filteredInvitedQuizzes = useMemo(() => {
    let result = invitedQuizzes;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(query) ||
          quiz.description?.toLowerCase().includes(query),
      );
    }
    if (selectedDifficulty) {
      result = result.filter((quiz) => quiz.difficulty_level === selectedDifficulty);
    }
    return result;
  }, [invitedQuizzes, searchQuery, selectedDifficulty]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border/30 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                Explore Quizzes
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Discover challenges from our community. Filter by difficulty or search for your favorite topics.
              </p>

              {/* Search & Difficulty Filters */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search quizzes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-base rounded-none border-border/50 bg-background shadow-sm focus:ring-0 focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { id: "easy", color: "bg-emerald-500" },
                    { id: "medium", color: "bg-amber-500" },
                    { id: "hard", color: "bg-rose-500" },
                  ].map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => setSelectedDifficulty(selectedDifficulty === diff.id ? null : diff.id)}
                      className={`h-12 px-4 text-xs font-bold uppercase tracking-widest border transition-all ${
                        selectedDifficulty === diff.id
                          ? "bg-foreground text-background border-foreground"
                          : "bg-background text-foreground border-border/50 hover:border-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 ${diff.color}`} />
                        {diff.id}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <Button
                  onClick={() => router.push("/dashboard/quizzes")}
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 border-2 rounded-none font-bold uppercase tracking-widest text-xs"
                >
                  My Quizzes
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="animate-pulse flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-muted-foreground">Loading quizzes...</p>
            </div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-4 p-12 rounded-none border border-border/50 bg-card max-w-md mx-auto">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-none bg-muted/50">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">
                  No quizzes available
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Check back later for new challenges from our community!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {user && filteredInvitedQuizzes.length > 0 && (
              <section className="space-y-12">
                <div className="flex items-end justify-between border-b border-border/30 pb-6">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground uppercase">
                      Invited Quizzes
                    </h2>
                    <p className="text-muted-foreground font-medium">
                      Private challenges you&apos;ve been invited to
                    </p>
                  </div>
                  <div className="px-4 py-1 bg-primary text-primary-foreground text-sm font-black">
                    {filteredInvitedQuizzes.length}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {filteredInvitedQuizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} showActions={false} />
                  ))}
                </div>
              </section>
            )}

            {filteredPublicQuizzes.length > 0 && (
              <section className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPublicQuizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} showActions={false} />
                  ))}
                </div>
              </section>
            )}

            {(filteredPublicQuizzes.length === 0 && filteredInvitedQuizzes.length === 0) && searchQuery && (
                <div className="flex items-center justify-center py-24">
                  <div className="text-center space-y-4 p-12 rounded-none border border-border/50 bg-card max-w-md mx-auto">
                    <div className="flex justify-center">
                      <div className="flex items-center justify-center w-16 h-16 rounded-none bg-muted/50">
                        <Search className="w-8 h-8 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">
                        No results found
                      </h2>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        We couldn&apos;t find any quizzes matching &quot;{searchQuery}&quot;
                      </p>
                      <Button
                        variant="link"
                        onClick={() => {setSearchQuery(""); setSelectedDifficulty(null);}}
                        className="text-primary mt-2 uppercase text-xs font-black tracking-widest"
                      >
                        Clear filters
                      </Button>
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
