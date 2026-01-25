"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CreateQuizForm } from "@/components/create-quiz-form";
import { CreateQuizInput, Quiz } from "@/lib/types/quiz";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateQuizPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const client = createClient();
      const {
        data: { user },
      } = await client.auth.getUser();
      if (!user) {
        router.push("/get-started/login");
      }
    };
    checkAuth();
  }, [router]);

  const handleCreateQuiz = async (data: CreateQuizInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create quiz");
      }

      const quiz = await response.json();
      router.push(`/quiz/edit/${quiz.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" bg-background text-foreground">
      {/* Header with gradient */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-3">
                  Build Your Quiz
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
                  Design an engaging and interactive quiz with custom questions,
                  multiple difficulty levels, time constraints, and smart
                  categorization. Test your audience's knowledge with a
                  professional assessment tool.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-10">
        {error && (
          <div className="mb-8 p-6 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm">
            <div className="font-semibold mb-2">Error creating quiz</div>
            <div className="text-destructive/90">{error}</div>
          </div>
        )}

        <div className=" bg-card/50 backdrop-blur-sm p-6 lg:p-16 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-2 mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Quiz Details</h2>
            <p className="text-muted-foreground">
              Fill in the basic information to get started with your new quiz
            </p>
          </div>
          <CreateQuizForm onSubmit={handleCreateQuiz} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
