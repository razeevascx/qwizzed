"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CreateQuizForm } from "@/components/create-quiz-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CreateQuizInput, Quiz } from "@/lib/types/quiz";
import { Sparkles } from "lucide-react";

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
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create quiz");
      }

      const quiz = await response.json();
      router.push(`/dashboard/quizzes/edit/${quiz.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-foreground">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create Quiz</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="space-y-6 mb-8 mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Create Quiz
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Design an engaging quiz with custom questions, difficulty levels,
              and smart categorization. Test your audience's knowledge.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
          <div className="font-semibold mb-2">Error creating quiz</div>
          <div className="text-destructive/90">{error}</div>
        </div>
      )}

      <div className="bg-card/40 rounded-lg p-8 shadow-sm">
        <div className="space-y-2 mb-8">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Quiz Details
          </h2>
          <p className="text-sm text-muted-foreground">
            Fill in the basic information to get started
          </p>
        </div>
        <CreateQuizForm onSubmit={handleCreateQuiz} isLoading={isLoading} />
      </div>
    </div>
  );
}
