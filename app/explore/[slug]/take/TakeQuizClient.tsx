"use client";

import { QuizResult } from "@/components/quiz-result";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Quiz, Question, QuestionOption } from "@/lib/types/quiz";
import { quizApi } from "@/lib/api-client";
import Layout from "@/components/layout/Layout";
import { toggleFullscreen } from "@/lib/fullscreen";
import { createClient } from "@/lib/supabase/client";

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

  const [hasStarted, setHasStarted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isStartingSubmission, setIsStartingSubmission] = useState(false);

  const pendingSubmissionKey = `pending-quiz-submission:${quizId}`;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
          setName(user.user_metadata?.full_name || user.user_metadata?.name || "");
          setEmail(user.email || "");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

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

  const createSubmission = async (customName?: string, customEmail?: string) => {
    const result = await quizApi.createSubmission(quizId, {
      name: customName || name,
      email: customEmail || email,
    });

    if (!result.ok) {
      if (result.error?.includes("401") || result.error?.includes("403")) {
        return { kind: "auth_required" as const };
      }
      throw new Error(result.error || "Failed to create submission");
    }

    return { kind: "ok" as const, submission: result.data };
  };

  const savePendingAnswers = (pendingAnswers: Record<string, string>) => {
    localStorage.setItem(
      pendingSubmissionKey,
      JSON.stringify({
        answers: pendingAnswers,
        name: name,
        email: email,
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
    savedName?: string,
    savedEmail?: string,
  ) => {
    try {
      // Create submission first
      const createResult = await createSubmission(savedName || name, savedEmail || email);
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

  const startQuizAttempt = async (startName: string, startEmail: string) => {
    if (!startName.trim()) {
      toast.error("Please enter your name.", "Name Required");
      return;
    }
    if (!startEmail.trim()) {
      toast.error("Please enter your email.", "Email Required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(startEmail)) {
      toast.error("Please enter a valid email address.", "Invalid Email");
      return;
    }

    setName(startName);
    setEmail(startEmail);
    setHasStarted(true);

    const timeLimitMinutes = Number(quiz?.time_limit_minutes);
    if (Number.isFinite(timeLimitMinutes) && timeLimitMinutes > 0) {
      setTimeLeft(timeLimitMinutes * 60);
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
          if (pending.name) setName(pending.name);
          if (pending.email) setEmail(pending.email);
          setHasStarted(true);
          await resumePendingSubmission(pending.answers, pending.name, pending.email);
          return;
        }
      }

      // Check auth status to skip prompt for logged in users
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (currentUser) {
        const defaultName = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || "";
        const defaultEmail = currentUser.email || "";
        setName(defaultName);
        setEmail(defaultEmail);

        const createResult = await createSubmission(defaultName, defaultEmail);
        if (createResult.kind === "ok") {
          setSubmissionId((createResult as any).submission.id);
          setHasStarted(true);

          const timeLimitMinutes = Number(quizData.time_limit_minutes);
          if (Number.isFinite(timeLimitMinutes) && timeLimitMinutes > 0) {
            setTimeLeft(timeLimitMinutes * 60);
          }
        }
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

  if (!hasStarted) {
    return (
      <Layout>
        <section className="w-full max-w-2xl mx-auto pt-24 px-6 pb-24 flex flex-col justify-center items-center min-h-[80vh]">
          <div className="w-full bg-card/50 backdrop-blur-md rounded-3xl border border-border/85 shadow-2xl p-8 space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Header */}
            <div className="space-y-3 text-center">
              <span className="px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                Ready to Start
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text">
                {quiz?.title || "Quiz"}
              </h1>
              {quiz?.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {quiz.description}
                </p>
              )}
            </div>

            {/* Quiz Info Badges */}
            <div className="flex flex-wrap justify-center gap-3 py-2 border-y border-border/50">
              {quiz?.category && (
                <span className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/30 border border-border/40 rounded-full">
                  Category: {quiz.category}
                </span>
              )}
              {quiz?.difficulty_level && (
                <span className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/30 border border-border/40 rounded-full capitalize">
                  Level: {quiz.difficulty_level}
                </span>
              )}
              {questions.length > 0 && (
                <span className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/30 border border-border/40 rounded-full">
                  {questions.length} Questions
                </span>
              )}
              {quiz?.time_limit_minutes ? (
                <span className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/30 border border-border/40 rounded-full">
                  Time: {quiz.time_limit_minutes}m
                </span>
              ) : null}
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name-input" className="text-sm font-semibold text-muted-foreground">
                    Display Name
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 px-4 rounded-2xl border border-border/80 bg-background hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email-input" className="text-sm font-semibold text-muted-foreground">
                    Email Address
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 rounded-2xl border border-border/80 bg-background hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <button
                onClick={() => startQuizAttempt(name, email)}
                className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-2xl hover:opacity-90 active:scale-95 transition-all duration-300 shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </section>
      </Layout>
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
