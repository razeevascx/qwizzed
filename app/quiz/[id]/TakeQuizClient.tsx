"use client";

import { QuizResult } from "@/components/quiz-result";

import { toast } from "@/hooks/use-toast";
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
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import { toggleFullscreen } from "@/lib/fullscreen";

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

  // Handle time out
  useEffect(() => {
    if (timeLeft === 0 && !showResults && !isSubmitting) {
      handleSubmitQuiz();
    }
  }, [timeLeft, showResults, isSubmitting]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };



  const handleSubmitQuiz = async () => {
    if (!submissionId) {
      toast.error("Submission session lost. Please reload the quiz.", "Error");
      return;
    }

    setIsSubmitting(true);
    try {
      // Format answers for batch submission
      const batchAnswers = Object.entries(answers).map(([qId, val]) => ({
        question_id: qId,
        user_answer: val,
      }));

      console.log("Submitting quiz:", { quizId, submissionId, answerCount: batchAnswers.length });
      const response = await fetch(
        `/api/quizzes/${quizId}/submissions/${submissionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: batchAnswers }),
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
      toast.success("Quiz submitted successfully! Great work.", "Success");
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to submit quiz. Please try again.",
        "Submission Failed"
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

  const handleFullscreenToggle = () => {
    toggleFullscreen(document.documentElement);
  };

  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto pt-10 px-6">
        <div className="flex flex-col gap-8">
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
