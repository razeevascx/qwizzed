"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateQuizForm } from "@/components/create-quiz-form";
import { BottomSheet } from "@/components/hangry-ui/components/bottom-sheet";
import type { CreateQuizInput } from "@/lib/types/quiz";

export default function CreateQuizPage({ intercepted = false }: { intercepted?: boolean }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateQuiz = async (data: CreateQuizInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create quiz");
      router.replace(`/app/quizzes/edit/${result.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create quiz");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BottomSheet
      open
      onClose={() => intercepted ? router.back() : router.replace("/app/quizzes")}
      title="Create Quiz"
      description="Fill in the details to start building your quiz."
    >
      {error && <p role="alert" className="mb-6 text-sm text-destructive">{error}</p>}
      <CreateQuizForm onSubmit={handleCreateQuiz} isLoading={isLoading} />
    </BottomSheet>
  );
}
