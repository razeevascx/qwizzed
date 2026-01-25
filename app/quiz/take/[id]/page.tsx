"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Quiz, Question, QuestionOption } from "@/lib/types/quiz";
import { ArrowLeft, Clock, BookOpen, Maximize2, Minimize2 } from "lucide-react";

interface QuestionWithOptions extends Question {
  question_options?: QuestionOption[];
}

export default function TakeQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params?.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submissionId, setSubmissionId] = useState<string | null>(null);
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
      if (!questionsResponse.ok) throw new Error("Failed to load questions");
      const questionsData = await questionsResponse.json();
      setQuestions(questionsData);

      // Create submission
      const submissionResponse = await fetch(
        `/api/quizzes/${quizId}/submissions`,
        {
          method: "POST",
        },
      );
      if (!submissionResponse.ok)
        throw new Error("Failed to create submission");
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
    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Header with gradient */}
        <div className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 relative">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back Home</span>
            </button>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              Quiz Completed!
            </h1>
            <p className="text-lg text-muted-foreground mt-3">
              Great job finishing the {quiz.title} quiz
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="space-y-10">
            {/* Result Card */}
            <div className="rounded-2xl border border-border/50 bg-card p-8 sm:p-10 overflow-hidden relative">
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-primary to-emerald-500" />

              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800">
                  <BookOpen className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Your Result
                  </p>
                  <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600">
                    {questions.length}/{questions.length}
                  </p>
                </div>

                <p className="text-lg text-muted-foreground">
                  You answered all questions correctly!
                </p>
              </div>
            </div>

            {/* Quiz Summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-border/50 bg-card p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Total Questions
                </p>
                <p className="text-2xl font-bold">{questions.length}</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-card p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">Quiz Title</p>
                <p className="text-lg font-semibold truncate">{quiz.title}</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-card p-4 text-center col-span-2 md:col-span-1">
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  Passed
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap justify-center pt-4">
              <Button
                onClick={() => router.push("/quizzes")}
                size="lg"
                className="min-w-48"
              >
                Explore More Quizzes
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/quiz/my-quizzes")}
                size="lg"
                className="min-w-48"
              >
                My Quizzes
              </Button>
            </div>
          </div>
        </div>
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
    <div
      className={`min-h-screen bg-background text-foreground flex flex-col ${isFullscreen ? "p-0" : ""}`}
    >
      {/* Header with progress */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/50">
        <div
          className={`${isFullscreen ? "px-8 py-3" : "max-w-6xl mx-auto px-4 sm:px-6 py-4"}`}
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <h1
                className={`${isFullscreen ? "text-2xl" : "text-xl sm:text-2xl"} font-bold truncate`}
              >
                {quiz.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {timeLeft !== null && (
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap border transition-all ${
                    timeLeft < 60
                      ? "bg-destructive/10 text-destructive border-destructive/30"
                      : "bg-muted/50 text-muted-foreground border-border/50"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  {formatTime(timeLeft)}
                </div>
              )}
              <button
                onClick={handleFullscreenToggle}
                className="p-2 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
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
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary via-primary to-primary/70 h-2 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className={`w-full ${isFullscreen ? "px-8 py-12" : "max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12"}`}
        >
          {/* Question Section - No card box */}
          <div>
            {/* Question Text */}
            <h2
              className={`${isFullscreen ? "text-8xl leading-[1.1]" : "text-3xl sm:text-4xl"} font-bold mb-12 leading-tight`}
            >
              {currentQuestion.question_text}
            </h2>

            {/* Answer Options */}
            <div
              className={`${isFullscreen ? "space-y-6 mb-20" : "space-y-3 mb-10"}`}
            >
              {currentQuestion.question_type === "short_answer" ? (
                <div className="space-y-3">
                  <label
                    className={`${isFullscreen ? "text-xl" : "text-sm"} font-semibold text-foreground`}
                  >
                    Your Answer
                  </label>
                  <textarea
                    placeholder="Type your answer here..."
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(currentQuestion.id, e.target.value)
                    }
                    rows={isFullscreen ? 8 : 5}
                    className={`w-full px-6 py-4 border-2 border-border/50 rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all resize-none ${isFullscreen ? "text-2xl" : ""}`}
                  />
                </div>
              ) : (
                <div className={isFullscreen ? "space-y-5" : "space-y-3"}>
                  {currentQuestion.question_options?.map((option, index) => (
                    <label
                      key={option.id}
                      className={`flex items-center ${isFullscreen ? "p-8" : "p-5"} rounded-xl border-2 cursor-pointer transition-all group ${
                        answers[currentQuestion.id] === option.id
                          ? "border-primary bg-primary/5"
                          : "border-border/50 hover:border-border/80 hover:bg-muted/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option.id}
                        checked={answers[currentQuestion.id] === option.id}
                        onChange={(e) =>
                          handleAnswerChange(currentQuestion.id, e.target.value)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`${isFullscreen ? "w-10 h-10 rounded-full border-3" : "w-6 h-6 rounded-full border-2"} flex-shrink-0 flex items-center justify-center transition-all ${
                          answers[currentQuestion.id] === option.id
                            ? "border-primary bg-primary"
                            : "border-border/50 group-hover:border-border"
                        }`}
                      >
                        {answers[currentQuestion.id] === option.id && (
                          <div
                            className={`${isFullscreen ? "w-4 h-4" : "w-2 h-2"} rounded-full bg-white`}
                          />
                        )}
                      </div>
                      <div className="ml-6 flex-1 flex items-center justify-between">
                        <span
                          className={`font-medium text-foreground group-hover:text-foreground transition-colors ${isFullscreen ? "text-3xl" : "text-base"}`}
                        >
                          {option.option_text}
                        </span>
                        <span
                          className={`flex-shrink-0 ml-4 ${isFullscreen ? "text-2xl font-bold" : "text-xs font-semibold"} text-muted-foreground`}
                        >
                          {String.fromCharCode(65 + index)}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className={`flex gap-3 ${isFullscreen ? "pt-12" : "pt-4"}`}>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
                }
                disabled={currentQuestionIndex === 0}
                className={`${isFullscreen ? "min-w-56 text-2xl py-8" : "min-w-32"}`}
              >
                <ArrowLeft
                  className={`${isFullscreen ? "w-6 h-6" : "w-4 h-4"} mr-2`}
                />
                Previous
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={isSubmitting || !answers[currentQuestion.id]}
                className={`flex-1 ${isFullscreen ? "text-2xl py-8" : ""}`}
              >
                {isSubmitting
                  ? "Submitting..."
                  : isLastQuestion
                    ? "Submit Quiz"
                    : "Next Question"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
