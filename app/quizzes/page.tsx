"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { QuizCard } from "@/components/quiz-card";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/lib/types/quiz";
import { useRouter } from "next/navigation";
import { Sparkles, BookOpen, Zap } from "lucide-react";

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadQuizzesAndCheckAuth();
  }, []);

  const loadQuizzesAndCheckAuth = async () => {
    try {
      const client = createClient();
      const {
        data: { user },
      } = await client.auth.getUser();
      setUser(user);

      const response = await fetch("/api/quizzes/published");
      if (!response.ok) throw new Error("Failed to load quizzes");
      const data = await response.json();
      setQuizzes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

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
                onClick={() => router.push("/quiz/my-quizzes")}
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

      {/* Content Section */}
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
                <h2 className="text-2xl font-bold">No quizzes available yet</h2>
                <p className="text-muted-foreground text-lg">
                  New quizzes coming soon. Check back later!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8 flex items-center gap-2">
              <h2 className="text-2xl font-semibold">
                {quizzes.length} {quizzes.length === 1 ? "Quiz" : "Quizzes"}{" "}
                Available
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} showActions={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
