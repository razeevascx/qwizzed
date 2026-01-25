"use client";

import { useEffect, useState } from "react";
import { CreateQuestionForm } from "@/components/create-question-form";
import { Button } from "@/components/ui/button";
import { Quiz, Question, CreateQuestionInput } from "@/lib/types/quiz";
import { Trash2, CheckCircle } from "lucide-react";

interface EditQuizClientProps {
  quizId: string;
}

export function EditQuizClient({ quizId }: EditQuizClientProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) return;
    loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/quizzes/${quizId}`);
      if (!response.ok) throw new Error("Failed to load quiz");
      const quizData = await response.json();
      setQuiz(quizData);

      const questionsResponse = await fetch(`/api/quizzes/${quizId}/questions`);
      if (!questionsResponse.ok) throw new Error("Failed to load questions");
      const questionsData = await questionsResponse.json();
      setQuestions(questionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = async (data: CreateQuestionInput) => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to add question");
      await loadQuiz();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      const response = await fetch(
        `/api/quizzes/${quizId}/questions/${questionId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete question");
      await loadQuiz();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handlePublishQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...quiz, is_published: true }),
      });

      if (!response.ok) throw new Error("Failed to publish quiz");
      const updatedQuiz = await response.json();
      setQuiz(updatedQuiz);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-muted-foreground">Quiz not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-bold tracking-tight mb-1">
                {quiz.title}
              </h1>
              <p className="text-muted-foreground text-lg">
                {quiz.description}
              </p>
            </div>
            {quiz.is_published ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold whitespace-nowrap flex-shrink-0 mt-2">
                <CheckCircle className="w-4 h-4" />
                Published
              </div>
            ) : (
              <Button onClick={handlePublishQuiz} size="lg" className="mt-2">
                <CheckCircle className="w-5 h-5 mr-2" />
                Publish Quiz
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Quiz Stats */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          <div className="p-4 rounded-xl border border-border/50 bg-card">
            <div className="text-sm text-muted-foreground mb-1">Questions</div>
            <div className="text-3xl font-bold">{quiz.total_questions}</div>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-card">
            <div className="text-sm text-muted-foreground mb-1">Difficulty</div>
            <div className="text-3xl font-bold capitalize">
              {quiz.difficulty_level}
            </div>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-card">
            <div className="text-sm text-muted-foreground mb-1">Category</div>
            <div className="text-3xl font-bold">{quiz.category}</div>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-card">
            <div className="text-sm text-muted-foreground mb-1">Time Limit</div>
            <div className="text-3xl font-bold">
              {quiz.time_limit_minutes || "—"}
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-6">Questions</h2>
            <div className="space-y-3 mb-8">
              {questions.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-border/50 bg-card/50 backdrop-blur">
                  <p className="text-muted-foreground">
                    No questions yet. Add your first question below.
                  </p>
                </div>
              ) : (
                questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="group relative rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-all duration-300 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            {index + 1}
                          </span>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            {question.question_type}
                          </span>
                        </div>
                        <p className="text-foreground font-medium line-clamp-2">
                          {question.question_text}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add Question Form */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-4">Add New Question</h3>
            </div>
            <CreateQuestionForm onSubmit={handleAddQuestion} />
          </div>
        </div>
      </div>
    </div>
  );
}
