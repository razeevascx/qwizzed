"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { CreateQuestionForm } from "@/components/create-question-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Quiz,
  Question,
  CreateQuestionInput,
  QuizVisibility,
} from "@/lib/types/quiz";
import { QuizInviteDialog } from "@/components/quiz-invite-dialog";
import { QuizInvitationsList } from "@/components/quiz-invitations-list";
import {
  Trash2,
  CheckCircle,
  Sparkles,
  ArrowLeft,
  Clock,
  BookOpen,
  Zap,
  AlertCircle,
  Globe,
  Lock,
  Mail,
} from "lucide-react";

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params?.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedVisibility, setSelectedVisibility] =
    useState<QuizVisibility>("public");

  useEffect(() => {
    if (!quizId) return;
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/quizzes/${quizId}`);
      if (!response.ok) throw new Error("Failed to load quiz");
      const quizData = await response.json();
      setQuiz(quizData);
      setSelectedVisibility(quizData.visibility || "public");

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

  const handleVisibilityChange = async (visibility: QuizVisibility) => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...quiz, visibility }),
      });

      if (!response.ok) throw new Error("Failed to update visibility");
      const updatedQuiz = await response.json();
      setQuiz(updatedQuiz);
      setSelectedVisibility(visibility);
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
      {/* Header with gradient */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="space-y-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                Edit Quiz
              </div>
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-3">
                      {quiz.title}
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                      {quiz.description}
                    </p>
                  </div>
                  {quiz.is_published ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold whitespace-nowrap flex-shrink-0 mt-2">
                      <CheckCircle className="w-4 h-4" />
                      Published
                    </div>
                  ) : (
                    <Button
                      onClick={handlePublishQuiz}
                      size="lg"
                      className="mt-2 gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Publish Quiz
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {error && (
          <div className="mb-8 p-6 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold mb-1">Error</div>
                <div className="text-destructive/90">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Visibility & Invitations */}
        <div className="mb-12 pb-12 border-b border-border/30">
          {/* Visibility Selector */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Quiz Visibility</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleVisibilityChange("public")}
                className={`flex flex-col items-start p-4 rounded-lg border-2 transition-all ${
                  selectedVisibility === "public"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/50 hover:border-border/80 hover:bg-accent/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Globe
                    className={`w-4 h-4 ${
                      selectedVisibility === "public"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`font-medium text-sm ${
                      selectedVisibility === "public"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    Public
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Anyone can find and take this quiz
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleVisibilityChange("private")}
                className={`flex flex-col items-start p-4 rounded-lg border-2 transition-all ${
                  selectedVisibility === "private"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/50 hover:border-border/80 hover:bg-accent/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Lock
                    className={`w-4 h-4 ${
                      selectedVisibility === "private"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`font-medium text-sm ${
                      selectedVisibility === "private"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    Private
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Only invited users can access
                </span>
              </button>
            </div>
          </div>

          {/* Invite Users Section - Only show for private quizzes */}
          {selectedVisibility === "private" && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold">Invited Users</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage who has access to this private quiz
                  </p>
                </div>
                <Button
                  onClick={() => setShowInviteDialog(true)}
                  className="gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Invite User
                </Button>
              </div>
              <QuizInvitationsList quizId={quizId} />
            </div>
          )}
        </div>

        {/* Questions Section */}
        <div className="space-y-8">
          <div>
            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-bold">Questions</h2>
              <p className="text-muted-foreground">
                Manage your quiz questions and build engaging assessments
              </p>
            </div>
            <div className="space-y-3">
              {questions.length === 0 ? (
                <div className="text-center py-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur">
                  <Sparkles className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">
                    No questions yet. Add your first question below to get
                    started
                  </p>
                </div>
              ) : (
                questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="group relative rounded-lg border border-border/50 bg-card/50 hover:bg-card hover:border-primary/40 transition-all duration-200 p-5 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            {question.question_type}
                          </span>
                        </div>
                        <p className="text-foreground font-medium line-clamp-2 text-base">
                          {question.question_text}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="flex-shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
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
          <div className="space-y-4 pt-4 border-t border-border/30">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Add New Question</h3>
              <p className="text-muted-foreground">
                Create a new question for your quiz
              </p>
            </div>
            <CreateQuestionForm onSubmit={handleAddQuestion} />
          </div>
        </div>

        {/* Quiz Stats */}
        <div className="mt-12 pt-12 border-t border-border/30">
          <div className="space-y-4 mb-8">
            <h3 className="text-2xl font-bold">Quiz Overview</h3>
            <p className="text-muted-foreground">
              Key metrics and information about your quiz
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-colors">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Questions
              </div>
              <div className="text-4xl font-bold text-primary">
                {quiz.total_questions}
              </div>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <div className="text-sm font-medium text-muted-foreground">
                  Difficulty
                </div>
              </div>
              <div
                className={`text-2xl font-bold capitalize ${
                  quiz.difficulty_level === "easy"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : quiz.difficulty_level === "medium"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {quiz.difficulty_level}
              </div>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <div className="text-sm font-medium text-muted-foreground">
                  Category
                </div>
              </div>
              <div className="text-2xl font-bold">{quiz.category}</div>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <div className="text-sm font-medium text-muted-foreground">
                  Time Limit
                </div>
              </div>
              <div className="text-2xl font-bold">
                {quiz.time_limit_minutes
                  ? `${quiz.time_limit_minutes}m`
                  : "Unlimited"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Dialog */}
      {showInviteDialog && (
        <QuizInviteDialog
          quizId={quizId}
          onClose={() => setShowInviteDialog(false)}
        />
      )}
    </div>
  );
}
