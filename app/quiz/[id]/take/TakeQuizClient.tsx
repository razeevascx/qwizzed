"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Quiz, Question, QuestionOption } from "@/lib/types/quiz";
import { Clock, BookOpen } from "lucide-react";

interface QuestionWithOptions extends Question {
  question_options?: QuestionOption[];
}

export default function TakeQuizClient() {
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

  useEffect(() => {
    if (!quizId) return;
    loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const response = await fetch(
        `/api/quizzes/${quizId}/submissions/${submissionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        const text = await response.text();
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
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-muted-foreground">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-muted-foreground">Quiz not found</div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="border-b border-border/50">
          <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold tracking-tight">
              Quiz Completed!
            </h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="space-y-8 text-center">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30">
                <BookOpen className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Great Job!</h2>
                <p className="text-xl text-muted-foreground">
                  Thank you for completing the {quiz.title} quiz.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-xl border border-border/50 bg-primary/5">
              <p className="text-sm text-muted-foreground mb-2">Your Result</p>
              <p className="text-5xl font-bold text-primary">
                {questions.length}/{questions.length}
              </p>
            </div>

            <div className="flex gap-4 flex-wrap justify-center">
              <Button
                onClick={() => router.push("/quizzes")}
                size="lg"
                className="min-w-40"
              >
                More Quizzes
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                size="lg"
                className="min-w-40"
              >
                Home
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border/50 sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold">{quiz.title}</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            {timeLeft !== null && (
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm whitespace-nowrap ${
                  timeLeft < 60
                    ? "bg-destructive/10 text-destructive"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            )}
          </div>

          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-primary/70 h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="rounded-xl border border-border/60 bg-card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-8">
            {currentQuestion.question_text}
          </h2>

          <div className="space-y-4 mb-8">
            {currentQuestion.question_type === "short_answer" ? (
              <textarea
                placeholder="Type your answer here..."
                value={answers[currentQuestion.id] || ""}
                onChange={(e) =>
                  handleAnswerChange(currentQuestion.id, e.target.value)
                }
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            ) : (
              <div className="space-y-3">
                {currentQuestion.question_options?.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[currentQuestion.id] === option.id
                        ? "border-primary bg-primary/10"
                        : "border-border/50 hover:border-border bg-card hover:bg-muted/50"
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
                      className="w-5 h-5 accent-primary"
                    />
                    <span className="ml-4 font-medium">
                      {option.option_text}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
              }
              disabled={currentQuestionIndex === 0}
              size="lg"
            >
              Previous
            </Button>
            <Button
              onClick={handleNextQuestion}
              disabled={isSubmitting}
              className="flex-1"
              size="lg"
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
  );
}
