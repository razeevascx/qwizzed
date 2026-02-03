"use client";

import { QuizResult } from "@/components/quiz-result";

import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Quiz, Question, QuestionOption } from "@/lib/types/quiz";
import { quizApi } from "@/lib/api-client";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Maximize2,
  Minimize2,
  CheckCircle2,
  LogOut,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { toggleFullscreen } from "@/lib/fullscreen";

interface QuestionWithOptions extends Question {
  question_options?: QuestionOption[];
}

type QuizWithQuestions = Quiz & { questions?: QuestionWithOptions[] };

export default function TakeQuizClient({
  quizId,
  initialQuiz,
}: {
  quizId: string;
  initialQuiz?: QuizWithQuestions | null;
}) {
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [releaseTimeLeft, setReleaseTimeLeft] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const pendingSubmissionKey = `pending-quiz-submission:${quizId}`;

  useEffect(() => {
    if (!quizId) return;
    if (initialQuiz) {
      initializeQuiz(initialQuiz);
      return;
    }
    loadQuiz();
  }, [quizId, initialQuiz]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResults]);

  // Handle time out
  useEffect(() => {
    if (timeLeft === 0 && !showResults && !isSubmitting) {
      handleSubmitQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, showResults, isSubmitting]);

  useEffect(() => {
    if (releaseTimeLeft === null || releaseTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setReleaseTimeLeft((prev) => (prev && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [releaseTimeLeft]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const createSubmission = async () => {
    const result = await quizApi.createSubmission(quizId);

    if (!result.ok) {
      if (result.error?.includes("401")) {
        return { kind: "auth_required" as const };
      }
      throw new Error(result.error || "Failed to create submission");
    }

    return { kind: "ok" as const, submission: result.data };
  };

  const submitAnswers = async (
    targetSubmissionId: string,
    batchAnswers: Array<{ question_id: string; user_answer: string }>,
  ) => {
    const result = await quizApi.submitAnswers(quizId, targetSubmissionId, {
      answers: batchAnswers,
    });

    if (!result.ok) {
      if (result.error?.includes("401")) {
        return { kind: "auth_required" as const };
      }
      throw new Error(result.error || "Failed to submit quiz");
    }

    return { kind: "ok" as const, result: result.data };
  };

  const savePendingAnswers = (pendingAnswers: Record<string, string>) => {
    localStorage.setItem(
      pendingSubmissionKey,
      JSON.stringify({
        answers: pendingAnswers,
        savedAt: new Date().toISOString(),
      }),
    );
  };

  const redirectToLogin = () => {
    setShowLoginPrompt(true);
    // Redirect to login with return path to show results after submission
    router.push(`/get-started?next=${encodeURIComponent(`/quiz/${quizId}`)}`);
  };

  const resumePendingSubmission = async (
    pendingAnswers: Record<string, string>,
  ) => {
    try {
      // Create submission first
      const createResult = await createSubmission();
      if (createResult.kind === "auth_required") {
        redirectToLogin();
        return;
      }

      setSubmissionId((createResult as any).submission.id);
      setAnswers(pendingAnswers);

      // Auto-submit pending answers since user is authenticated
      // and backend will extract name/email from session
      setCurrentQuestionIndex(questions.length - 1);
    } catch (err) {
      console.error("Failed to resume submission:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to submit quiz. Please try again.",
        "Submission Failed",
      );
    }
  };

  const initializeQuiz = async (quizData: QuizWithQuestions) => {
    try {
      setQuiz(quizData);

      const releaseAt = quizData.release_at
        ? new Date(quizData.release_at).getTime()
        : null;
      const now = Date.now();
      if (releaseAt && releaseAt > now) {
        setReleaseTimeLeft(Math.ceil((releaseAt - now) / 1000));
        return;
      }

      setReleaseTimeLeft(null);
      setQuestions(quizData.questions || []);

      const pendingRaw = localStorage.getItem(pendingSubmissionKey);
      if (pendingRaw) {
        const pending = JSON.parse(pendingRaw);
        if (pending?.answers) {
          setAnswers(pending.answers);
          await resumePendingSubmission(pending.answers);
          return;
        }
      }

      const createResult = await createSubmission();
      if (createResult.kind === "ok") {
        setSubmissionId((createResult as any).submission.id);
      }

      const timeLimitMinutes = Number(quizData.time_limit_minutes);
      if (Number.isFinite(timeLimitMinutes) && timeLimitMinutes > 0) {
        setTimeLeft(timeLimitMinutes * 60);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      const result = await quizApi.getQuiz(quizId);
      if (!result.ok || !result.data) {
        throw new Error(result.error || "Failed to load quiz");
      }
      await initializeQuiz(result.data as QuizWithQuestions);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    // Check if user is authenticated
    if (!submissionId) {
      // Not authenticated - show error and redirect to login
      toast.error("You need to login to submit your quiz", "Login Required");
      setTimeout(() => {
        redirectToLogin();
      }, 500);
      return;
    }
    // If logged in, submit directly
    await submitQuizAnswers();
  };

  const submitQuizAnswers = async () => {
    setIsSubmitting(true);
    try {
      // Format answers for batch submission
      const batchAnswers = Object.entries(answers).map(([qId, val]) => ({
        question_id: qId,
        user_answer: val,
      }));

      // Get user info from authenticated session
      // The backend will use the authenticated user's name/email
      const finalSubmissionId = submissionId;

      if (!finalSubmissionId) {
        throw new Error("Submission ID is required");
      }

      // Submit answers - backend will use authenticated user's name/email
      const submitResult = await submitAnswers(finalSubmissionId, batchAnswers);

      if (submitResult.kind === "auth_required") {
        savePendingAnswers(answers);
        redirectToLogin();
        setIsSubmitting(false);
        return;
      }

      // Clear pending data
      localStorage.removeItem(pendingSubmissionKey);

      setSubmissionResult(submitResult.result);
      setShowResults(true);
      toast.success("Quiz submitted successfully! Great work.", "Success");
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to submit quiz. Please try again.",
        "Submission Failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 animate-pulse">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">Loading quiz...</p>
            <p className="text-sm text-muted-foreground">
              Please wait while we prepare your quiz
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (releaseTimeLeft !== null && releaseTimeLeft > 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-lg w-full rounded-2xl border border-border bg-card p-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10">
              <Clock className="w-7 h-7 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Quiz releases soon</h2>
              <p className="text-muted-foreground">
                This quiz will be available in
              </p>
            </div>
            <div className="text-3xl font-bold text-primary">
              {formatReleaseCountdown(releaseTimeLeft)}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
            <BookOpen className="w-8 h-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold">Quiz Not Found</p>
            <p className="text-muted-foreground">
              The quiz you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <Button onClick={() => router.push("/quizzes")} className="min-w-40">
            Browse Quizzes
          </Button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <QuizResult
        submissionResult={submissionResult}
        questionsCount={questions.length}
        quiz={quiz}
        onRetake={() => window.location.reload()}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  function formatReleaseCountdown(seconds: number) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m ${secs}s`;
  }

  const handleFullscreenToggle = () => {
    toggleFullscreen(document.documentElement);
  };

  const handleExitQuiz = () => {
    if (Object.keys(answers).length > 0) {
      setShowExitConfirm(true);
    } else {
      router.push("/quiz");
    }
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    router.push("/quiz");
  };

  return (
    <Layout>
      <div className="w-full max-w-8xl mx-auto pt-10 px-6">
        <div className="flex flex-col gap-8">
          {showLoginPrompt && (
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">
                    Sign in to submit your answers
                  </p>
                  <p className="text-xs text-muted-foreground">
                    We saved your answers. Sign in to submit and see results.
                  </p>
                </div>
                <Button onClick={redirectToLogin} className="w-full sm:w-auto">
                  Sign in to submit
                </Button>
              </div>
            </div>
          )}

          {showExitConfirm && (
            <div className="rounded-xl border border-amber-200/40 bg-amber-50 dark:bg-amber-950/20 p-4 sm:p-5">
              <div className="flex flex-col gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                    Exit quiz?
                  </p>
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    You have unsaved answers. They will be lost if you exit
                    without submitting.
                  </p>
                </div>
                <div className="flex gap-3 sm:flex-row-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExitConfirm(false)}
                    className="flex-1 sm:flex-none"
                  >
                    Continue Quiz
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={confirmExit}
                    className="flex-1 sm:flex-none"
                  >
                    Exit Without Saving
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Header Info */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-xl font-bold truncate max-w-md text-foreground">
                {quiz?.title}
              </h1>
              {quiz?.organizer_name && (
                <p className="text-xs text-primary font-medium">
                  Organized by {quiz.organizer_name}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {timeLeft !== null && (
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm border ${
                    timeLeft < 60
                      ? "bg-destructive/10 text-destructive border-destructive/20"
                      : "bg-muted/50 text-foreground border-border/50"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  {formatTime(timeLeft ?? 0)}
                </div>
              )}
              <button
                onClick={handleFullscreenToggle}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={handleExitQuiz}
                className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                title="Exit quiz"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Main Content */}
          <div className="flex justify-center w-full">
            <div className="w-full">
              {/* Question Card */}
              <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
                  Question {currentQuestionIndex + 1}
                </div>
                <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-4 tracking-tight">
                  {currentQuestion.question_text}
                </h2>
                {currentQuestion.points && (
                  <p className="text-muted-foreground font-medium">
                    Worth {currentQuestion.points}{" "}
                    {currentQuestion.points === 1 ? "point" : "points"}
                  </p>
                )}
              </div>

              {/* Answer Options */}
              <div className="space-y-4 mb-10">
                {currentQuestion.question_type === "short_answer" ||
                currentQuestion.question_type === "fill_in_blank" ? (
                  <div className="">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      {currentQuestion.question_type === "fill_in_blank"
                        ? "Fill in the blank"
                        : "Your Answer"}
                    </label>
                    <textarea
                      placeholder={
                        currentQuestion.question_type === "fill_in_blank"
                          ? "Type your answer..."
                          : "Write your answer here..."
                      }
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(currentQuestion.id, e.target.value)
                      }
                      rows={
                        currentQuestion.question_type === "fill_in_blank"
                          ? 2
                          : 5
                      }
                      className="w-full px-6 py-5 border border-border/50 rounded-2xl bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all resize-none text-xl"
                    />
                  </div>
                ) : (
                  <div className="space-y-3 ">
                    {currentQuestion.question_options?.map((option, index) => {
                      const isSelected =
                        answers[currentQuestion.id] === option.id;
                      const letter = String.fromCharCode(65 + index);

                      return (
                        <label
                          key={option.id}
                          className={`group relative flex items-center gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                              : "border-border/40 hover:border-border hover:bg-card/50 hover:shadow-md"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            value={option.id}
                            checked={isSelected}
                            onChange={(e) =>
                              handleAnswerChange(
                                currentQuestion.id,
                                e.target.value,
                              )
                            }
                            className="sr-only"
                          />

                          {/* Letter Badge */}
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                              isSelected
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "bg-muted/50 text-muted-foreground group-hover:bg-muted"
                            }`}
                          >
                            {letter}
                          </div>

                          {/* Option Text */}
                          <div className="flex-1">
                            <span className="text-lg font-medium text-foreground transition-colors">
                              {option.option_text}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-4">
                {currentQuestionIndex > 0 && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() =>
                      setCurrentQuestionIndex(currentQuestionIndex - 1)
                    }
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                )}
                <Button
                  onClick={handleNextQuestion}
                  disabled={isSubmitting || !answers[currentQuestion.id]}
                  size="lg"
                  className="flex-1 gap-2 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : isLastQuestion ? (
                    <>
                      Submit Quiz
                      <CheckCircle2 className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    <>
                      Next Question
                      <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
