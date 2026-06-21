"use client";

import { QuizResult } from "@/components/quiz-result";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Quiz, Question, QuestionOption } from "@/lib/types/quiz";
import { quizApi } from "@/lib/api-client";
import Layout from "@/components/layout/Layout";
import { toggleFullscreen } from "@/lib/fullscreen";

// Sub-components
import { QuizLoading } from "./_components/QuizLoading";
import { QuizNotFound } from "./_components/QuizNotFound";
import { QuizReleaseTimer } from "./_components/QuizReleaseTimer";
import { QuizHeader } from "./_components/QuizHeader";
import { QuizQuestionDisplay } from "./_components/QuizQuestionDisplay";
import { QuizNavigation } from "./_components/QuizNavigation";
import { QuizPrompts } from "./_components/QuizPrompts";

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
      if (result.error?.includes("401") || result.error?.includes("403")) {
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
      if (result.error?.includes("401") || result.error?.includes("403")) {
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
    // Redirect to login with return path to resume quiz after login
    router.push(`/get-started?redirect=${encodeURIComponent(`/explore/${quizId}/take`)}`);
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

      const newSubmissionId = (createResult as any).submission.id;
      setSubmissionId(newSubmissionId);
      setAnswers(pendingAnswers);

      // Auto-submit pending answers since user is authenticated
      toast.success("Submitting your saved answers...", "Welcome back!");

      // Format answers for batch submission
      const batchAnswers = Object.entries(pendingAnswers).map(([qId, val]) => ({
        question_id: qId,
        user_answer: val,
      }));

      // Submit answers
      const submitResult = await submitAnswers(newSubmissionId, batchAnswers);

      if (submitResult.kind === "auth_required") {
        // This shouldn't happen, but handle it just in case
        savePendingAnswers(pendingAnswers);
        redirectToLogin();
        return;
      }

      // Clear pending data
      localStorage.removeItem(pendingSubmissionKey);

      // Show results
      setSubmissionResult(submitResult.result);
      setShowResults(true);
      toast.success("Quiz submitted successfully! Great work.", "Success");
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
      // Not authenticated - save answers and redirect to login
      savePendingAnswers(answers);
      toast.success("Your answers have been saved! Please login to submit.", "Answers Saved");
      setTimeout(() => {
        redirectToLogin();
      }, 1000);
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

  const handleFullscreenToggle = () => {
    toggleFullscreen(document.documentElement);
  };

  const handleExitQuiz = () => {
    if (Object.keys(answers).length > 0) {
      setShowExitConfirm(true);
    } else {
      router.push("/explore");
    }
  };

  if (isLoading) return <QuizLoading />;

  if (releaseTimeLeft !== null && releaseTimeLeft > 0) {
    return <QuizReleaseTimer releaseTimeLeft={releaseTimeLeft} />;
  }

  if (!quiz || questions.length === 0) return <QuizNotFound />;

  if (showResults) {
    return (
      <QuizResult
        submissionResult={submissionResult}
        questionsCount={questions.length}
        quiz={quiz}
        onRetake={() => globalThis.location.reload()}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Layout>
      <section className="w-full max-w-8xl mx-auto pt-24 px-6 pb-24">
        <div className="grid gap-6">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight  tracking-tight">
            {currentQuestion.question_text}
          </h2>
          <div className="relative w-full h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <QuizHeader
            title={quiz.title}
            organizerName={quiz.organizer_name}
            timeLeft={timeLeft}
            isFullscreen={isFullscreen}
            onFullscreenToggle={handleFullscreenToggle}
            onExit={handleExitQuiz}
          />
          <QuizPrompts
            showLoginPrompt={showLoginPrompt}
            showExitConfirm={showExitConfirm}
            onRedirectToLogin={redirectToLogin}
            onCancelExit={() => setShowExitConfirm(false)}
            onConfirmExit={() => router.push("/explore")}
          />

          {/* Progress Bar */}

          <QuizQuestionDisplay
            question={currentQuestion}
            index={currentQuestionIndex}
            answer={answers[currentQuestion.id]}
            onAnswerChange={handleAnswerChange}
          />

          <QuizNavigation
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            isSubmitting={isSubmitting}
            hasAnswer={!!answers[currentQuestion.id]}
            onPrevious={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            onNext={handleNextQuestion}
          />
        </div>
      </section>
    </Layout>
  );
}
