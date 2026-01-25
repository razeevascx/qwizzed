"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Quiz, Question, QuestionOption } from "@/lib/types/quiz";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface QuestionWithOptions extends Question {
  question_options?: QuestionOption[];
}

export default function TakeQuizClient({ quizId }: { quizId: string }) {
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!quizId) return;
    loadQuiz();
  }, [quizId]);

  useEffect(() => {
    if (!timeLeft || timeLeft <= 0 || !submissionId) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, submissionId]);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/quizzes/${quizId}`);
      if (!response.ok) throw new Error("Failed to load quiz");
      const quizData = await response.json();
      setQuiz(quizData);

      const questionsResponse = await fetch(`/api/quizzes/${quizId}/questions`);
      if (!questionsResponse.ok) {
        const errorData = await questionsResponse.json();
        console.error("Questions fetch failed:", errorData);
        throw new Error(errorData.error || "Failed to load questions");
      }
      const questionsData = await questionsResponse.json();
      setQuestions(questionsData);

      // Create submission
      const submissionResponse = await fetch(
        `/api/quizzes/${quizId}/submissions`,
        {
          method: "POST",
        },
      );
      if (!submissionResponse.ok) {
        const errorData = await submissionResponse.json();
        console.error("Submission creation failed:", errorData);
        throw new Error(errorData.error || "Failed to create submission");
      }
      const submission = await submissionResponse.json();
      setSubmissionId(submission.id);

      // Set timer if quiz has time limit
      if (quizData.time_limit_minutes) {
        setTimeLeft(quizData.time_limit_minutes * 60);
      }
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

  const handleNextQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = answers[currentQuestion.id];

    if (!userAnswer) {
      alert("Please select an answer");
      return;
    }

    if (!submissionId) {
      alert("Submission not created. Please reload and try again.");
      return;
    }

    try {
      // Save answer
      await fetch(`/api/quizzes/${quizId}/submissions/${submissionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: currentQuestion.id,
          user_answer: userAnswer,
        }),
      });

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        handleSubmitQuiz();
      }
    } catch (err) {
      console.error("Failed to save answer:", err);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!submissionId) {
      alert("Submission not created. Please reload and try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting quiz:", { quizId, submissionId });
      const response = await fetch(
        `/api/quizzes/${quizId}/submissions/${submissionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        },
      );

      console.log("Submit response status:", response.status);

      if (!response.ok) {
        const text = await response.text();
        console.error("Submit error response:", text);
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = { error: text || "Unknown error" };
        }
        throw new Error(
          errorData.error ||
            `Failed to submit quiz (Status: ${response.status})`,
        );
      }

      const result = await response.json();
      setSubmissionResult(result);
      setShowResults(true);
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to submit quiz. Please try again.",
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
    const scorePercentage = submissionResult?.total_points
      ? Math.round(
          (submissionResult.score / submissionResult.total_points) * 100,
        )
      : 0;
    const isPassed = scorePercentage >= 50;
    const timeTakenMinutes = submissionResult?.time_taken
      ? Math.floor(submissionResult.time_taken / 60)
      : 0;
    const timeTakenSeconds = submissionResult?.time_taken
      ? submissionResult.time_taken % 60
      : 0;

    return (
      <div className=" bg-background">
        <Layout>
          {/* Results */}
          <div className="space-y-12">
            {/* Score */}
            <div className="text-center py-8 border-y border-border/50">
              <p className="text-7xl font-bold mb-2">{scorePercentage}%</p>
              <p className="text-sm text-muted-foreground">YOUR SCORE</p>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h1
                className={`text-5xl font-bold ${
                  isPassed
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {isPassed ? "Passed!" : "Good Effort!"}
              </h1>
              <p className="text-muted-foreground">
                {isPassed
                  ? "You've successfully completed the quiz"
                  : "Keep practicing and you'll nail it next time"}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 rounded-xl border border-border/50">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Points Earned
                </p>
                <p className="text-3xl font-bold">
                  {submissionResult?.score || 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  of {submissionResult?.total_points || 0}
                </p>
              </div>

              <div className="text-center p-6 rounded-xl border border-border/50">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Questions
                </p>
                <p className="text-3xl font-bold">{questions.length}</p>
                <p className="text-sm text-muted-foreground mt-1">answered</p>
              </div>

              <div className="text-center p-6 rounded-xl border border-border/50">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Time Taken
                </p>
                <p className="text-3xl font-bold">
                  {timeTakenMinutes > 0
                    ? `${timeTakenMinutes}m`
                    : `${timeTakenSeconds}s`}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {timeTakenMinutes > 0 && `${timeTakenSeconds}s`}
                </p>
              </div>

              <div className="text-center p-6 rounded-xl border border-border/50">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Status
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isPassed
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {isPassed ? "Passed" : "Review"}
                </p>
              </div>
            </div>

            {/* Message */}
            <div
              className={`p-6 rounded-xl border ${
                isPassed
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/50"
                  : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/50"
              }`}
            >
              <p className="text-center text-sm">
                {isPassed
                  ? scorePercentage >= 90
                    ? "Outstanding! You've mastered this topic."
                    : scorePercentage >= 70
                      ? "Great job! Solid understanding."
                      : "Well done! You passed."
                  : scorePercentage >= 40
                    ? "You're on the right track. Review and try again."
                    : "Study the content and come back stronger."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 m-4">
              <Button
                onClick={() => router.push("/quizzes")}
                size="lg"
                className="flex-1 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                Explore More Quizzes
              </Button>
              {!isPassed && (
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  size="lg"
                  className="flex-1 text-base font-semibold rounded-xl border-2 hover:bg-muted/50 transition-all hover:scale-[1.02]"
                >
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </Layout>
      </div>
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

  const handleFullscreenToggle = async () => {
    try {
      const elem = document.documentElement;
      if (!isFullscreen) {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).mozRequestFullScreen) {
          await (elem as any).mozRequestFullScreen();
        } else if ((elem as any).msRequestFullscreen) {
          await (elem as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/quizzes")}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                title="Exit Quiz"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold truncate max-w-md">
                  {quiz.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {timeLeft !== null && (
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${
                    timeLeft < 60
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  {formatTime(timeLeft)}
                </div>
              )}
              <button
                onClick={handleFullscreenToggle}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-2 bg-muted/50 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Question Card */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Question {currentQuestionIndex + 1}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
              {currentQuestion.question_text}
            </h2>
            {currentQuestion.points && (
              <p className="text-muted-foreground">
                Worth {currentQuestion.points}{" "}
                {currentQuestion.points === 1 ? "point" : "points"}
              </p>
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.question_type === "short_answer" ||
            currentQuestion.question_type === "fill_in_blank" ? (
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
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
                    currentQuestion.question_type === "fill_in_blank" ? 2 : 5
                  }
                  className="w-full px-5 py-4 border-2 border-border/50 rounded-2xl bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all resize-none text-lg"
                />
              </div>
            ) : (
              <div className="space-y-3">
                {currentQuestion.question_options?.map((option, index) => {
                  const isSelected = answers[currentQuestion.id] === option.id;
                  const letter = String.fromCharCode(65 + index);

                  return (
                    <label
                      key={option.id}
                      className={`group relative flex items-start gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${
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
                          handleAnswerChange(currentQuestion.id, e.target.value)
                        }
                        className="sr-only"
                      />

                      {/* Letter Badge */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "bg-muted/50 text-muted-foreground group-hover:bg-muted"
                        }`}
                      >
                        {letter}
                      </div>

                      {/* Option Text */}
                      <div className="flex-1 pt-1.5">
                        <span className="text-lg font-medium text-foreground">
                          {option.option_text}
                        </span>
                      </div>

                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className="flex-shrink-0">
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
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
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : isLastQuestion ? (
                <>
                  Submit Quiz
                  <CheckCircle2 className="w-5 h-5" />
                </>
              ) : (
                <>
                  Next Question
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
