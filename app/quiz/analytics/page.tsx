import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Clock,
  Target,
  Trophy,
  Calendar,
  XCircle,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";

type QuizDetail = {
  id: string;
  title: string;
  totalQuestions: number;
  difficulty: string;
  category: string;
  isPublished: boolean;
  visibility: string;
  createdAt: string;
  totalAttempts: number;
  uniqueUsers: number;
  avgScore: number;
  highestScore: number;
  lowestScore: number;
  lastAttempt: Date | null;
};

async function getAnalyticsData(userId: string) {
  const supabase = await createClient();

  const { data: quizzes, error: quizzesError } = await supabase
    .from("quizzes")
    .select(
      "id, title, created_at, is_published, visibility, total_questions, difficulty_level, category",
    )
    .eq("creator_id", userId)
    .order("created_at", { ascending: false });

  if (quizzesError) throw quizzesError;

  const totalQuizzes = quizzes?.length || 0;
  const publishedQuizzes = quizzes?.filter((q) => q.is_published).length || 0;

  const quizDetails: QuizDetail[] = await Promise.all(
    quizzes?.map(async (quiz) => {
      const { data: submissions } = await supabase
        .from("quiz_submissions")
        .select(
          `
          id,
          score,
          total_points,
          submitted_at,
          status,
          user_id
        `,
        )
        .eq("quiz_id", quiz.id)
        .eq("status", "graded");

      const totalAttempts = submissions?.length || 0;
      const uniqueUsers = new Set(submissions?.map((s) => s.user_id) || [])
        .size;

      const avgScore =
        submissions && submissions.length > 0
          ? Math.round(
              submissions.reduce(
                (sum, sub) =>
                  sum +
                  (sub.total_points > 0
                    ? (sub.score / sub.total_points) * 100
                    : 0),
                0,
              ) / submissions.length,
            )
          : 0;

      const highestScore =
        submissions && submissions.length > 0
          ? Math.max(
              ...submissions.map((s) =>
                s.total_points > 0 ? (s.score / s.total_points) * 100 : 0,
              ),
            )
          : 0;

      const lowestScore =
        submissions && submissions.length > 0
          ? Math.min(
              ...submissions.map((s) =>
                s.total_points > 0 ? (s.score / s.total_points) * 100 : 0,
              ),
            )
          : 0;

      const lastAttempt =
        submissions && submissions.length > 0
          ? new Date(
              Math.max(
                ...submissions.map((s) => new Date(s.submitted_at).getTime()),
              ),
            )
          : null;

      return {
        id: quiz.id,
        title: quiz.title,
        totalQuestions: quiz.total_questions,
        difficulty: quiz.difficulty_level,
        category: quiz.category,
        isPublished: quiz.is_published,
        visibility: quiz.visibility,
        createdAt: quiz.created_at,
        totalAttempts,
        uniqueUsers,
        avgScore: Math.round(avgScore),
        highestScore: Math.round(highestScore),
        lowestScore: Math.round(lowestScore),
        lastAttempt,
      } satisfies QuizDetail;
    }) || [],
  );

  const totalAttempts = quizDetails.reduce(
    (sum, q) => sum + q.totalAttempts,
    0,
  );
  const totalUniqueUsers = quizDetails.reduce(
    (sum, q) => sum + q.uniqueUsers,
    0,
  );
  const overallAvgScore =
    quizDetails.length > 0
      ? Math.round(
          quizDetails.reduce((sum, q) => sum + q.avgScore, 0) /
            quizDetails.length,
        )
      : 0;

  return {
    totalQuizzes,
    publishedQuizzes,
    totalAttempts,
    totalUniqueUsers,
    overallAvgScore,
    quizDetails,
  };
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          Loading analytics...
        </div>
      }
    >
      <AnalyticsContent />
    </Suspense>
  );
}

async function AnalyticsContent() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/get-started");
  }

  const {
    totalQuizzes,
    publishedQuizzes,
    totalAttempts,
    totalUniqueUsers,
    overallAvgScore,
    quizDetails,
  } = await getAnalyticsData(user.id);

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen space-y-10 pb-16">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                <BarChart3 className="h-3 w-3" />
                Analytics Dashboard
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                Quiz Analytics
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Track performance, engagement, and insights across all your
                quizzes
              </p>
            </div>
            <Link
              href="/quiz/create"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
            >
              <BarChart3 className="h-4 w-4" />
              Create New Quiz
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-linear-to-br from-blue-500/10 via-blue-500/5 to-transparent p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/40 hover:-translate-y-1">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 ring-4 ring-blue-500/10 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-7 w-7" />
              </div>
              <TrendingUp className="h-4 w-4 text-blue-500/50" />
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-black tracking-tight text-blue-500">
                {totalQuizzes}
              </p>
              <p className="text-sm font-semibold text-foreground">
                Total Quizzes
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {publishedQuizzes} published · {totalQuizzes - publishedQuizzes}{" "}
                draft
              </p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-linear-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-500/40 hover:-translate-y-1">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 ring-4 ring-emerald-500/10 group-hover:scale-110 transition-transform">
                <Users className="h-7 w-7" />
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-black tracking-tight text-emerald-500">
                {totalAttempts}
              </p>
              <p className="text-sm font-semibold text-foreground">
                Total Attempts
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {totalUniqueUsers} {totalUniqueUsers === 1 ? "user" : "users"}
              </p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-linear-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:border-amber-500/40 hover:-translate-y-1">
          <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 ring-4 ring-amber-500/10 group-hover:scale-110 transition-transform">
                <Award className="h-7 w-7" />
              </div>
              <Trophy className="h-4 w-4 text-amber-500/50" />
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-black tracking-tight text-amber-500">
                {overallAvgScore}%
              </p>
              <p className="text-sm font-semibold text-foreground">
                Average Score
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                Across all quiz attempts
              </p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-violet-500/20 bg-linear-to-br from-violet-500/10 via-violet-500/5 to-transparent p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20 hover:border-violet-500/40 hover:-translate-y-1">
          <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 ring-4 ring-violet-500/10 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7" />
              </div>
              <Clock className="h-4 w-4 text-violet-500/50" />
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-black tracking-tight text-violet-500">
                {totalAttempts > 0 ? "↑" : "—"}
              </p>
              <p className="text-sm font-semibold text-foreground">
                Activity Status
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {totalAttempts > 0
                  ? "Actively receiving submissions"
                  : "Awaiting first attempt"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Quiz Reports */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Your Quizzes</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Performance, engagement, and status at a glance
            </p>
          </div>
          <Link
            href="/quiz/create"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <PlusCircle className="h-4 w-4" />
            New Quiz
          </Link>
        </div>

        {quizDetails.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {quizDetails.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/quiz/analytics/${quiz.id}`}
                className="group block rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm transition hover:border-primary/50 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                      <Target className="h-3.5 w-3.5" />
                      {quiz.category}
                    </div>
                    <h3 className="text-xl font-bold leading-tight">
                      {quiz.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-medium">
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                        <Users className="h-3.5 w-3.5" /> {quiz.uniqueUsers}{" "}
                        users
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                        <BarChart3 className="h-3.5 w-3.5" />{" "}
                        {quiz.totalAttempts} attempts
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                        <Award className="h-3.5 w-3.5" /> Avg {quiz.avgScore}%
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                        <Trophy className="h-3.5 w-3.5" /> High{" "}
                        {quiz.highestScore}%
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                        <XCircle className="h-3.5 w-3.5" /> Low{" "}
                        {quiz.lowestScore}%
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border">
                      {quiz.isPublished ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {quiz.visibility}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-border group-hover:border-primary/40 transition-colors">
                    <div className="flex items-center gap-2 text-primary mb-1.5">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">
                        Engagement
                      </span>
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      {quiz.totalAttempts} attempts · {quiz.uniqueUsers} users
                    </p>
                  </div>

                  {quiz.lastAttempt ? (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-muted/80 to-muted/40 border border-border group-hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">
                          Last Try
                        </span>
                      </div>
                      <p className="text-sm font-bold">
                        {formatDate(quiz.lastAttempt)}
                      </p>
                    </div>
                  ) : (
                    <div className="p-8 rounded-xl bg-muted/30 border-2 border-dashed border-border/50 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-3">
                        <Clock className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        No attempts yet for this quiz
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Share your quiz to start collecting data
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-border bg-card/50">
            <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No quizzes yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first quiz to start tracking analytics
            </p>
            <Link
              href="/quiz/create"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              <BarChart3 className="h-4 w-4" />
              Create Quiz
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
