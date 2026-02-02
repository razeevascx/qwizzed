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
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
  rank: number;
};

async function getAnalyticsData(
  userId: string,
  {
    startDate,
    endDate,
  }: {
    startDate?: string;
    endDate?: string;
  },
) {
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

  const startAt = startDate ? new Date(startDate) : null;
  if (startAt) startAt.setHours(0, 0, 0, 0);

  const endAt = endDate ? new Date(endDate) : null;
  if (endAt) endAt.setHours(23, 59, 59, 999);

  const quizDetails = await Promise.all(
    quizzes?.map(async (quiz) => {
      let submissionsQuery = supabase
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

      if (startAt) {
        submissionsQuery = submissionsQuery.gte(
          "submitted_at",
          startAt.toISOString(),
        );
      }

      if (endAt) {
        submissionsQuery = submissionsQuery.lte(
          "submitted_at",
          endAt.toISOString(),
        );
      }

      const { data: submissions } = await submissionsQuery;

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
        rank: 0,
      } satisfies QuizDetail;
    }) || [],
  );

  const rankedQuizDetails = [...quizDetails]
    .sort((a, b) => {
      if (b.totalAttempts !== a.totalAttempts) {
        return b.totalAttempts - a.totalAttempts;
      }
      if (b.avgScore !== a.avgScore) {
        return b.avgScore - a.avgScore;
      }
      return a.title.localeCompare(b.title);
    })
    .map((quiz, index) => ({
      ...quiz,
      rank: index + 1,
    }));

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
    quizDetails: rankedQuizDetails,
  };
}

export default function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          Loading analytics...
        </div>
      }
    >
      <AnalyticsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function AnalyticsContent({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/get-started");
  }

  const resolvedSearchParams = await searchParams;
  const startDate = resolvedSearchParams?.start;
  const endDate = resolvedSearchParams?.end;

  const {
    totalQuizzes,
    publishedQuizzes,
    totalAttempts,
    totalUniqueUsers,
    overallAvgScore,
    quizDetails,
  } = await getAnalyticsData(user.id, { startDate, endDate });

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen space-y-8 pb-16">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Analytics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track performance and engagement across your quizzes
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <form className="flex flex-wrap gap-2" method="get">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-muted-foreground">
                From
              </label>
              <input
                name="start"
                type="date"
                defaultValue={startDate}
                className="h-9 rounded-md border border-border/50 bg-background px-3 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-muted-foreground">
                To
              </label>
              <input
                name="end"
                type="date"
                defaultValue={endDate}
                className="h-9 rounded-md border border-border/50 bg-background px-3 text-sm"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="h-9 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                Apply
              </button>
              {(startDate || endDate) && (
                <Link
                  href="/dashboard/analytics"
                  className="h-9 rounded-md border border-border/60 px-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  Clear
                </Link>
              )}
            </div>
          </form>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <BarChart3 className="h-4 w-4" />
            New Quiz
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border/40 bg-card/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalQuizzes}</p>
            <p className="text-xs text-muted-foreground font-medium">
              Total Quizzes
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {publishedQuizzes} published · {totalQuizzes - publishedQuizzes}{" "}
              draft
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border/40 bg-card/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {totalAttempts}
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              Total Attempts
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalUniqueUsers} {totalUniqueUsers === 1 ? "user" : "users"}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border/40 bg-card/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {overallAvgScore}%
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              Average Score
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Across all attempts
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border/40 bg-card/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {totalAttempts > 0 ? "Active" : "Idle"}
            </p>
            <p className="text-xs text-muted-foreground font-medium">Status</p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalAttempts > 0
                ? "Receiving submissions"
                : "Awaiting submissions"}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Quiz Reports */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Quizzes</h2>

        {quizDetails.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {quizDetails.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/dashboard/analytics/${quiz.id}`}
                className="group rounded-lg border border-border/40 bg-card/50 p-4 transition hover:border-border/60 hover:bg-card/70"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition">
                        {quiz.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/50">
                          <BookOpen className="h-3 w-3" />
                          {quiz.category}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/50">
                          <Trophy className="h-3 w-3" />
                          {quiz.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-xs space-y-1">
                      <div className="inline-flex items-center justify-center rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        Rank #{quiz.rank}
                      </div>
                      <div className="font-semibold text-foreground">
                        {quiz.isPublished ? "Published" : "Draft"}
                      </div>
                      <div className="text-muted-foreground">
                        {quiz.visibility}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        Users
                      </div>
                      <div className="text-sm font-semibold">
                        {quiz.uniqueUsers}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <BarChart3 className="h-3.5 w-3.5" />
                        Attempts
                      </div>
                      <div className="text-sm font-semibold">
                        {quiz.totalAttempts}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Award className="h-3.5 w-3.5" />
                        Avg Score
                      </div>
                      <div className="text-sm font-semibold">
                        {quiz.avgScore}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        Last Try
                      </div>
                      <div className="text-sm font-semibold">
                        {quiz.lastAttempt ? formatDate(quiz.lastAttempt) : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-border/40 bg-card/50">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No quizzes yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Create your first quiz to start tracking analytics
            </p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
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
