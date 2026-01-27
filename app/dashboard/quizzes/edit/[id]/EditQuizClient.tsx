"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreateQuestionForm } from "@/components/create-question-form";
import { UpdateQuestionForm } from "@/components/update-question-form";
import { EditQuizDetailsForm } from "@/components/edit-quiz-details-form";
import { QuizInviteDialog } from "@/components/quiz-invite-dialog";
import { QuizInvitationsList } from "@/components/quiz-invitations-list";
import { Button } from "@/components/ui/button";
import {
  Quiz,
  Question,
  CreateQuestionInput,
  QuizVisibility,
} from "@/lib/types/quiz";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Globe,
  Lock,
  Trash2,
  Edit2,
  Save,
} from "lucide-react";

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params?.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [showEditDetails, setShowEditDetails] = useState(false);
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

  const handleUpdateQuizDetails = async (data: any) => {
    try {
      setIsUpdating(true);
      setError(null);
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update quiz details");
      const updatedQuiz = await response.json();
      setQuiz(updatedQuiz);
      setShowEditDetails(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update details");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateQuestion = async (data: any) => {
    if (!editingQuestionId) return;
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/quizzes/${quizId}/questions/${editingQuestionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update question");
      await loadQuiz();
      setEditingQuestionId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsUpdating(false);
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
      setShowAddQuestionForm(false);
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
    <div className="bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              <button
                type="button"
                onClick={() => router.back()}
                className="hover:text-foreground transition"
              >
                Back
              </button>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold leading-tight">
                {quiz.title}
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl">
                {quiz.description}
              </p>
            </div>
          </div>
          {quiz.is_published ? (
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/40 px-3 py-1.5 text-emerald-600 text-xs font-semibold">
              <CheckCircle className="h-4 w-4" />
              Published
            </div>
          ) : (
            <Button size="sm" variant="outline" onClick={handlePublishQuiz}>
              Publish
            </Button>
          )}
        </div>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <div>
                <div className="font-medium">Error</div>
                <p className="text-destructive/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Visibility */}
        <section className="space-y-4 rounded-lg border border-border/60 p-5">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Visibility</h2>
            <p className="text-sm text-muted-foreground">
              Choose who can access this quiz.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleVisibilityChange("public")}
              className={`flex flex-col gap-1 rounded-md border px-3 py-3 text-left transition ${
                selectedVisibility === "public"
                  ? "border-primary bg-primary/5"
                  : "border-border/60 hover:border-border"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Globe className="h-4 w-4" /> Public
              </div>
              <p className="text-xs text-muted-foreground">
                Anyone with the link can view and take the quiz.
              </p>
            </button>
            <button
              type="button"
              onClick={() => handleVisibilityChange("private")}
              className={`flex flex-col gap-1 rounded-md border px-3 py-3 text-left transition ${
                selectedVisibility === "private"
                  ? "border-primary bg-primary/5"
                  : "border-border/60 hover:border-border"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Lock className="h-4 w-4" /> Private
              </div>
              <p className="text-xs text-muted-foreground">
                Only invited users can access this quiz.
              </p>
            </button>
          </div>

          {selectedVisibility === "private" && (
            <div className="space-y-3 border-t border-border/60 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Invitations</p>
                  <p className="text-xs text-muted-foreground">
                    Invite people to take this private quiz.
                  </p>
                </div>
                <Button size="sm" onClick={() => setShowInviteDialog(true)}>
                  Invite
                </Button>
              </div>
              <QuizInvitationsList quizId={quizId} />
            </div>
          )}
        </section>

        {/* Questions */}
        <section className="space-y-4 rounded-lg border border-border/60 p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Questions</h2>
              <p className="text-sm text-muted-foreground">
                Review and manage your questions.
              </p>
            </div>
            <Button
              size="sm"
              variant={showAddQuestionForm ? "ghost" : "outline"}
              onClick={() => setShowAddQuestionForm(!showAddQuestionForm)}
            >
              {showAddQuestionForm ? "Close" : "Add question"}
            </Button>
          </div>

          {showAddQuestionForm && (
            <div className="rounded-md border border-border/60 p-4">
              <div className="mb-4 space-y-1">
                <p className="text-sm font-medium">New question</p>
                <p className="text-xs text-muted-foreground">
                  Provide the prompt, choices, and the correct answer.
                </p>
              </div>
              <CreateQuestionForm onSubmit={handleAddQuestion} />
            </div>
          )}

          <div className="space-y-3">
            {questions.length === 0 ? (
              <div className="rounded-md border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
                No questions yet. Start by adding your first one.
              </div>
            ) : (
              questions.map((question, index) => (
                <div key={question.id}>
                  {editingQuestionId === question.id ? (
                    <UpdateQuestionForm
                      question={question}
                      onSubmit={handleUpdateQuestion}
                      onCancel={() => setEditingQuestionId(null)}
                      isLoading={isUpdating}
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-3 rounded-md border border-border/60 p-4 transition-all hover:bg-muted/5 group">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="rounded-full border border-border/60 px-2 py-0.5 text-[11px] font-medium">
                            {index + 1}
                          </span>
                          <span className="rounded-full bg-muted px-2 py-0.5 font-medium">
                            {question.question_type.replace("_", " ")}
                          </span>
                          <span className="text-primary font-bold ml-1">• {question.points || 1} pts</span>
                        </div>
                        <p className="text-sm text-foreground leading-snug">
                          {question.question_text}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingQuestionId(question.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Quiz Details */}
        <section className="space-y-4 rounded-lg border border-border/60 p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Quiz Details</h2>
              <p className="text-sm text-muted-foreground">
                Manage the basic information of your quiz.
              </p>
            </div>
            <Button
              size="sm"
              variant={showEditDetails ? "ghost" : "outline"}
              onClick={() => setShowEditDetails(!showEditDetails)}
              className="gap-2"
            >
              {showEditDetails ? (
                "Close"
              ) : (
                <>
                  <Edit2 className="w-4 h-4" /> Edit Details
                </>
              )}
            </Button>
          </div>

          {showEditDetails ? (
            <div className="rounded-md border border-border/60 p-4 bg-muted/5">
              <EditQuizDetailsForm
                quiz={quiz}
                onSubmit={handleUpdateQuizDetails}
                isLoading={isUpdating}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-md border border-border/60 p-4">
                <p className="text-xs text-muted-foreground transition-colors group-hover:text-primary">Questions</p>
                <p className="text-2xl font-semibold">{quiz.total_questions}</p>
              </div>
              <div className="rounded-md border border-border/60 p-4">
                <p className="text-xs text-muted-foreground">Difficulty</p>
                <p className="text-lg font-semibold capitalize">
                  {quiz.difficulty_level}
                </p>
              </div>
              <div className="rounded-md border border-border/60 p-4">
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="text-lg font-semibold">{quiz.category}</p>
              </div>
              <div className="rounded-md border border-border/60 p-4">
                <p className="text-xs text-muted-foreground">Time limit</p>
                <p className="text-lg font-semibold">
                  {quiz.time_limit_minutes
                    ? `${quiz.time_limit_minutes}m`
                    : "None"}
                </p>
              </div>
            </div>
          )}
        </section>

        {showInviteDialog && (
          <QuizInviteDialog
            quizId={quizId}
            onClose={() => setShowInviteDialog(false)}
          />
        )}
      </div>
    </div>
  );
}
