"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CreateQuestionForm } from "@/components/create-question-form";
import { UpdateQuestionForm } from "@/components/update-question-form";
import { EditQuizDetailsForm } from "@/components/edit-quiz-details-form";
import { QuizInviteDialog } from "@/components/quiz-invite-dialog";
import { QuizInvitationsList } from "@/components/quiz-invitations-list";
import { Button } from "@/components/ui/button";
import { Quiz, CreateQuestionInput, QuizVisibility } from "@/lib/types/quiz";
import { quizApi } from "@/lib/api-client";
import {
  AlertCircle,
  CheckCircle,
  Globe,
  Lock,
  Trash2,
  Edit2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function EditQuizPage() {
  const params = useParams();
  const quizId = params?.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [selectedVisibility, setSelectedVisibility] =
    useState<QuizVisibility>("public");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [editingSchedule, setEditingSchedule] = useState(false);
  const [scheduleInput, setScheduleInput] = useState("");
  const [editingQuestionPoints, setEditingQuestionPoints] = useState<
    string | null
  >(null);
  const [pointsInput, setPointsInput] = useState("");

  useEffect(() => {
    if (!quizId) return;
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      const result = await quizApi.getQuiz(quizId);
      if (!result.ok || !result.data) {
        throw new Error(result.error || "Failed to load quiz");
      }
      const quizData = result.data as any;
      setQuiz(quizData as Quiz);
      setTitleInput(quizData.title || "");
      setScheduleInput(
        quizData.scheduled_at
          ? new Date(quizData.scheduled_at).toISOString().slice(0, 16)
          : "",
      );
      setSelectedVisibility(quizData.visibility || "public");
      setQuestions(quizData.questions || []);
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
      const result = await quizApi.updateQuiz(quizId, {
        ...data,
        is_published: false,
      });
      if (!result.ok || !result.data) {
        throw new Error(result.error || "Failed to update quiz details");
      }
      setQuiz(result.data as any);
      setShowEditDetails(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update details");
    } finally {
      setIsUpdating(false);
    }
  };

  const unpublishQuizIfNeeded = async () => {
    if (quiz?.is_published) {
      await quizApi.updateQuiz(quizId, { ...quiz, is_published: false });
    }
  };

  const handleUpdateQuestion = async (data: any) => {
    if (!editingQuestionId) return;
    try {
      setIsUpdating(true);
      const result = await quizApi.updateQuestion(
        quizId,
        editingQuestionId,
        data,
      );
      if (!result.ok) {
        throw new Error(result.error || "Failed to update question");
      }
      await unpublishQuizIfNeeded();
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
      const result = await quizApi.createQuestion(quizId, data);
      if (!result.ok) {
        throw new Error(result.error || "Failed to add question");
      }
      await unpublishQuizIfNeeded();
      await loadQuiz();
      setShowAddQuestionForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      const result = await quizApi.deleteQuestion(quizId, questionId);
      if (!result.ok) {
        throw new Error(result.error || "Failed to delete question");
      }
      await unpublishQuizIfNeeded();
      await loadQuiz();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleMoveQuestion = async (
    questionId: string,
    direction: "up" | "down",
  ) => {
    const currentIndex = questions.findIndex((q) => q.id === questionId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= questions.length) return;

    try {
      const newQuestions = [...questions];
      [newQuestions[currentIndex], newQuestions[newIndex]] = [
        newQuestions[newIndex],
        newQuestions[currentIndex],
      ];

      const updates = newQuestions.map((q, idx) => ({
        id: q.id,
        order: idx,
      }));

      const result = await quizApi.reorderQuestions(quizId, updates);
      if (!result.ok)
        throw new Error(result.error || "Failed to reorder questions");

      await unpublishQuizIfNeeded();
      setQuestions(newQuestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reorder");
    }
  };

  const handleDragStart = (e: React.DragEvent, questionId: string) => {
    setDraggedId(questionId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, questionId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(questionId);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetQuestionId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetQuestionId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const draggedIndex = questions.findIndex((q) => q.id === draggedId);
    const targetIndex = questions.findIndex((q) => q.id === targetQuestionId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    try {
      const newQuestions = [...questions];
      const [draggedQuestion] = newQuestions.splice(draggedIndex, 1);
      newQuestions.splice(targetIndex, 0, draggedQuestion);

      const updates = newQuestions.map((q, idx) => ({
        id: q.id,
        order: idx,
      }));

      const result = await quizApi.reorderQuestions(quizId, updates);
      if (!result.ok)
        throw new Error(result.error || "Failed to reorder questions");

      await unpublishQuizIfNeeded();
      setQuestions(newQuestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reorder");
    } finally {
      setDraggedId(null);
      setDragOverId(null);
    }
  };

  const handlePublishQuiz = async () => {
    try {
      const result = await quizApi.updateQuiz(quizId, {
        ...quiz,
        is_published: true,
      });
      if (!result.ok || !result.data) {
        throw new Error(result.error || "Failed to publish quiz");
      }
      setQuiz(result.data as any);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleVisibilityChange = async (visibility: QuizVisibility) => {
    try {
      const result = await quizApi.updateQuiz(quizId, {
        ...quiz,
        visibility,
      });
      if (!result.ok || !result.data) {
        throw new Error(result.error || "Failed to update visibility");
      }
      setQuiz(result.data as any);
      setSelectedVisibility(visibility);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleUpdateTitle = async () => {
    if (!titleInput.trim() || titleInput === quiz?.title) {
      setEditingTitle(false);
      return;
    }
    try {
      setIsUpdating(true);
      setError(null);
      const result = await quizApi.updateQuiz(quizId, {
        ...quiz,
        title: titleInput.trim(),
        is_published: false,
      });
      if (!result.ok || !result.data) {
        throw new Error(result.error || "Failed to update title");
      }
      setQuiz(result.data as any);
      setEditingTitle(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update title");
      setTitleInput(quiz?.title || "");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateSchedule = async () => {
    if (
      !scheduleInput ||
      scheduleInput ===
        (quiz?.scheduled_at
          ? new Date(quiz.scheduled_at).toISOString().slice(0, 16)
          : "")
    ) {
      setEditingSchedule(false);
      return;
    }
    try {
      setIsUpdating(true);
      setError(null);
      const scheduledAt = scheduleInput
        ? new Date(scheduleInput).toISOString()
        : null;
      const result = await quizApi.updateQuiz(quizId, {
        ...quiz,
        scheduled_at: scheduledAt,
        is_published: false,
      });
      if (!result.ok || !result.data) {
        throw new Error(result.error || "Failed to update schedule");
      }
      setQuiz(result.data as any);
      setScheduleInput(
        (result.data as any).scheduled_at
          ? new Date((result.data as any).scheduled_at).toISOString().slice(0, 16)
          : "",
      );
      setEditingSchedule(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update schedule",
      );
      setScheduleInput(
        quiz?.scheduled_at
          ? new Date(quiz.scheduled_at).toISOString().slice(0, 16)
          : "",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateQuestionPoints = async (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (
      !question ||
      !pointsInput ||
      parseInt(pointsInput) === question.points
    ) {
      setEditingQuestionPoints(null);
      setPointsInput("");
      return;
    }
    try {
      setIsUpdating(true);
      setError(null);
      const result = await quizApi.updateQuestion(quizId, questionId, {
        ...question,
        points: parseInt(pointsInput),
      });
      if (!result.ok || !result.data) {
        throw new Error(result.error || "Failed to update points");
      }
      setQuestions(
        questions.map((q) => (q.id === questionId ? result.data : q)),
      );
      setEditingQuestionPoints(null);
      setPointsInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update points");
    } finally {
      setIsUpdating(false);
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
    <div className="bg-background text-foreground min-h-screen">
      <div className="space-y-8 px-6 py-8">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/quizzes">
                My Quizzes
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Quiz</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-2 flex-1">
            {editingTitle ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={handleUpdateTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUpdateTitle();
                    if (e.key === "Escape") {
                      setEditingTitle(false);
                      setTitleInput(quiz?.title || "");
                    }
                  }}
                  autoFocus
                  disabled={isUpdating}
                  className="flex-1 text-4xl font-bold bg-background border border-border/60 rounded px-2 py-1"
                />
              </div>
            ) : (
              <h1
                className="text-4xl font-bold cursor-pointer hover:text-primary transition-colors"
                onClick={() => {
                  setEditingTitle(true);
                  setTitleInput(quiz?.title || "");
                }}
              >
                {quiz.title}
              </h1>
            )}
            <p className="text-base text-muted-foreground">
              {quiz.description}
            </p>
          </div>
          <div className="flex-shrink-0">
            {quiz.is_published ? (
              <div className="flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle className="h-4 w-4" />
                Published
              </div>
            ) : (
              <Button size="sm" onClick={handlePublishQuiz}>
                Publish Draft
              </Button>
            )}
          </div>
        </div>

        {!quiz.is_published && (
          <div className="rounded-lg border border-amber-200/40 bg-amber-50/50 dark:bg-amber-950/20 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                  Changes saved as draft
                </p>
                <p className="text-amber-800 dark:text-amber-300 text-xs mt-1">
                  Your changes are saved but not yet published. Click "Publish
                  Draft" to make them live.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-destructive text-sm">Error</p>
                <p className="text-destructive/80 text-xs mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Questions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Questions</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your quiz questions
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={showAddQuestionForm ? "secondary" : "outline"}
                  onClick={() => setShowAddQuestionForm(!showAddQuestionForm)}
                >
                  {showAddQuestionForm ? "Cancel" : "Add Question"}
                </Button>
              </div>

              {showAddQuestionForm && (
                <div className="rounded-lg border border-border/60 p-5 bg-muted/30">
                  <div className="mb-4">
                    <p className="text-sm font-semibold">New Question</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add a new question to your quiz
                    </p>
                  </div>
                  <CreateQuestionForm onSubmit={handleAddQuestion} />
                </div>
              )}

              <div className="space-y-3">
                {questions.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border/50 p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No questions yet. Create your first question to get
                      started.
                    </p>
                  </div>
                ) : (
                  questions.map((question, index) => (
                    <div
                      key={question.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, question.id)}
                      onDragOver={(e) => handleDragOver(e, question.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, question.id)}
                      className={`transition-all cursor-move ${
                        draggedId === question.id ? "opacity-50" : ""
                      } ${
                        dragOverId === question.id
                          ? "border-t-2 border-t-primary pt-1"
                          : ""
                      }`}
                    >
                      {editingQuestionId === question.id ? (
                        <UpdateQuestionForm
                          question={question}
                          onSubmit={handleUpdateQuestion}
                          onCancel={() => setEditingQuestionId(null)}
                          isLoading={isUpdating}
                        />
                      ) : (
                        <div className="flex items-start justify-between gap-4 rounded-lg border border-border/60 p-4 hover:bg-muted/40 transition-colors group">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground line-clamp-2 mb-2">
                                {question.question_text}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap text-xs">
                                <span className="inline-block px-2 py-0.5 rounded-full bg-muted text-[11px] font-medium">
                                  {question.question_type.replace("_", " ")}
                                </span>
                                {editingQuestionPoints === question.id ? (
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      value={pointsInput}
                                      onChange={(e) =>
                                        setPointsInput(e.target.value)
                                      }
                                      onBlur={() =>
                                        handleUpdateQuestionPoints(question.id)
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter")
                                          handleUpdateQuestionPoints(
                                            question.id,
                                          );
                                        if (e.key === "Escape") {
                                          setEditingQuestionPoints(null);
                                          setPointsInput("");
                                        }
                                      }}
                                      autoFocus
                                      disabled={isUpdating}
                                      className="w-12 text-xs bg-background border border-border/60 rounded px-1 py-0.5 text-primary font-semibold [&::-webkit-outer-spin-button]:[appearance:none] [&::-webkit-inner-spin-button]:[appearance:none] [&::-moz-number-spin-box]:[display:none] [&::-moz-appearance:textfield]"
                                    />
                                    <span className="text-primary font-semibold text-xs">
                                      pts
                                    </span>
                                  </div>
                                ) : (
                                  <span
                                    onClick={() => {
                                      setEditingQuestionPoints(question.id);
                                      setPointsInput(
                                        String(question.points || 1),
                                      );
                                    }}
                                    className="text-primary font-semibold text-xs cursor-pointer hover:text-primary/80 transition-colors"
                                  >
                                    {question.points || 1} pts
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleMoveQuestion(question.id, "up")
                              }
                              disabled={index === 0}
                              className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-40"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleMoveQuestion(question.id, "down")
                              }
                              disabled={index === questions.length - 1}
                              className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-40"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingQuestionId(question.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
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
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            {/* Visibility Section */}
            <div className="space-y-4 rounded-lg border border-border/60 p-5">
              <div>
                <h3 className="text-sm font-semibold">Visibility</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Who can access this quiz
                </p>
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleVisibilityChange("public")}
                  className={`w-full flex items-start gap-3 rounded-md border p-3 text-left transition ${
                    selectedVisibility === "public"
                      ? "border-primary bg-primary/5"
                      : "border-border/60 hover:border-border/80"
                  }`}
                >
                  <Globe className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium">Public</div>
                    <p className="text-xs text-muted-foreground">
                      Anyone with link
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleVisibilityChange("private")}
                  className={`w-full flex items-start gap-3 rounded-md border p-3 text-left transition ${
                    selectedVisibility === "private"
                      ? "border-primary bg-primary/5"
                      : "border-border/60 hover:border-border/80"
                  }`}
                >
                  <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium">Private</div>
                    <p className="text-xs text-muted-foreground">
                      Invited only
                    </p>
                  </div>
                </button>
              </div>

              {selectedVisibility === "private" && (
                <div className="space-y-3 border-t border-border/60 pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold">Invitations</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Invite users
                      </p>
                    </div>
                    <Button size="sm" onClick={() => setShowInviteDialog(true)}>
                      Invite
                    </Button>
                  </div>
                  <QuizInvitationsList quizId={quizId} />
                </div>
              )}
            </div>

            {/* Quiz Details Section */}
            <div className="space-y-4 rounded-lg border border-border/60 p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold">Details</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Quiz information
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowEditDetails(!showEditDetails)}
                  className="h-8 w-8 -mr-2"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>

              {showEditDetails ? (
                <div className="rounded-md border border-border/60 p-4 bg-muted/20">
                  <EditQuizDetailsForm
                    quiz={quiz}
                    onSubmit={handleUpdateQuizDetails}
                    isLoading={isUpdating}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-md border border-border/60 p-3 bg-muted/20">
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="text-sm font-semibold mt-1">
                      {quiz.category}
                    </p>
                  </div>
                  <div className="rounded-md border border-border/60 p-3 bg-muted/20">
                    <p className="text-xs text-muted-foreground">Difficulty</p>
                    <p className="text-sm font-semibold mt-1 capitalize">
                      {quiz.difficulty_level}
                    </p>
                  </div>
                  {quiz.time_limit_minutes && (
                    <div className="rounded-md border border-border/60 p-3 bg-muted/20">
                      <p className="text-xs text-muted-foreground">
                        Time Limit
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        {quiz.time_limit_minutes} minutes
                      </p>
                    </div>
                  )}
                  <div className="rounded-md border border-border/60 p-3 bg-muted/20">
                    <p className="text-xs text-muted-foreground">Schedule</p>
                    {editingSchedule ? (
                      <input
                        type="datetime-local"
                        value={scheduleInput}
                        onChange={(e) => setScheduleInput(e.target.value)}
                        onBlur={handleUpdateSchedule}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdateSchedule();
                          if (e.key === "Escape") {
                            setEditingSchedule(false);
                            setScheduleInput(
                              quiz?.scheduled_at
                                ? new Date(quiz.scheduled_at)
                                    .toISOString()
                                    .slice(0, 16)
                                : "",
                            );
                          }
                        }}
                        autoFocus
                        disabled={isUpdating}
                        className="w-full text-sm bg-background border border-border/60 rounded px-2 py-1 mt-1"
                      />
                    ) : (
                      <p
                        onClick={() => {
                          setEditingSchedule(true);
                          setScheduleInput(
                            quiz?.scheduled_at
                              ? new Date(quiz.scheduled_at)
                                  .toISOString()
                                  .slice(0, 16)
                              : "",
                          );
                        }}
                        className="text-sm font-semibold mt-1 cursor-pointer hover:text-primary transition-colors"
                      >
                        {quiz.scheduled_at
                          ? new Date(quiz.scheduled_at).toLocaleString()
                          : "Not scheduled"}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

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
