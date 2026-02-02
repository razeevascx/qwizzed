import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Award,
  Trophy,
  Target,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
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

async function getQuizAnalytics(quizId: string, userId: string) {
  const supabase = await createClient();

  // Get quiz details
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select(
      "id, title, description, created_at, is_published, visibility, total_questions, difficulty_level, category, creator_id",
    )
    .eq("id", quizId)
    .single();

  if (quizError || !quiz) return { kind: "not_found" as const };
  if (quiz.creator_id !== userId) return { kind: "forbidden" as const };

  // Get all submissions
  const { data: submissions } = await supabase
    .from("quiz_submissions")
    .select(
      `
      id,
      score,
      total_points,
      submitted_at,
      status,
      time_taken,
      user_id,
      submitted_by_email,
      submitted_by_name
    `,
    )
    .eq("quiz_id", quizId)
    .eq("status", "graded")
    .order("submitted_at", { ascending: false });

  // Get questions with their options
  const { data: questions } = await supabase
    .from("questions")
    .select(
      `
      id,
      question_text,
      question_type,
      points,
      question_options (
        id,
        option_text,
        is_correct
      )
    `,
    )
    .eq("quiz_id", quizId)
    .order("created_at");

  // Calculate statistics
  const totalAttempts = submissions?.length || 0;
  const uniqueUsers = new Set(submissions?.map((s) => s.user_id) || []).size;

  const scores =
    submissions?.map((s) =>
      s.total_points > 0 ? (s.score / s.total_points) * 100 : 0,
    ) || [];

  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
      : 0;
  const highestScore = scores.length > 0 ? Math.round(Math.max(...scores)) : 0;
  const lowestScore = scores.length > 0 ? Math.round(Math.min(...scores)) : 0;

  // Score distribution
  const perfectScores = scores.filter((s) => s >= 90).length;
  const goodScores = scores.filter((s) => s >= 70 && s < 90).length;
  const fairScores = scores.filter((s) => s >= 50 && s < 70).length;
  const poorScores = scores.filter((s) => s < 50).length;

  // Time statistics (if available)
  const timeTaken = submissions
    ?.filter((s) => s.time_taken)
    .map((s) => s.time_taken) as number[];
  const avgTimeTaken =
    timeTaken && timeTaken.length > 0
      ? Math.round(timeTaken.reduce((sum, t) => sum + t, 0) / timeTaken.length)
      : 0;

  // Recent submissions
  const recentSubmissions = submissions?.slice(0, 10) || [];

  // Completion rate over time (group by week)
  const submissionsByWeek = submissions?.reduce(
    (acc, sub) => {
      const week = new Date(sub.submitted_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[week] = (acc[week] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    kind: "ok" as const,
    quiz,
    questions: questions || [],
    totalAttempts,
    uniqueUsers,
    avgScore,
    highestScore,
    lowestScore,
    perfectScores,
    goodScores,
    fairScores,
    poorScores,
    avgTimeTaken,
    recentSubmissions,
    submissionsByWeek: submissionsByWeek || {},
  };
}

export default function QuizAnalyticsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          Loading analytics...
        </div>
      }
    >
      <QuizAnalyticsContent params={params} />
    </Suspense>
  );
}

async function QuizAnalyticsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/get-started");
  }

  const analytics = await getQuizAnalytics(id, user.id);

  if (analytics.kind === "not_found") {
    notFound();
  }

  if (analytics.kind === "forbidden") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md space-y-4 text-center">
          <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
          <h1 className="text-2xl font-semibold">
            You dont have access to this quizs analytics.
          </h1>
          <p className="text-muted-foreground">
            Analytics are only available to the quiz owner. If you believe this
            is an error, ensure youre signed in with the correct account.
          </p>
          <Link
            href="/dashboard/analytics"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Back to Analytics
          </Link>
        </div>
      </div>
    );
  }

  const {
    quiz,
    questions,
    totalAttempts,
    uniqueUsers,
    avgScore,
    highestScore,
    perfectScores,
    goodScores,
    fairScores,
    poorScores,
    avgTimeTaken,
    recentSubmissions,
  } = analytics;

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/analytics">
              Analytics
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{quiz.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              {quiz.title}
            </h1>
            {quiz.description && (
              <p className="text-muted-foreground text-lg">
                {quiz.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {quiz.category}
              </span>
              <span className="capitalize">{quiz.difficulty_level}</span>
              <span>{quiz.total_questions} questions</span>
              {quiz.is_published ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
                  Published
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-500/10 text-slate-500 text-xs font-semibold">
                  Draft
                </span>
              )}
            </div>
          </div>
          <Link
            href={`/quizzes/edit/${quiz.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            Edit Quiz
          </Link>
        </div>
      </div>

      {totalAttempts > 0 ? (
        <>
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-gradient-to-br from-blue-500/5 to-blue-500/0 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Attempts
                  </p>
                  <p className="text-2xl font-bold">{totalAttempts}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {uniqueUsers} unique {uniqueUsers === 1 ? "user" : "users"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-gradient-to-br from-emerald-500/5 to-emerald-500/0 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{avgScore}%</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Across all attempts
              </p>
            </div>

            <div className="rounded-xl border border-border bg-gradient-to-br from-violet-500/5 to-violet-500/0 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Highest Score</p>
                  <p className="text-2xl font-bold">{highestScore}%</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Best result</p>
            </div>

            <div className="rounded-xl border border-border bg-gradient-to-br from-amber-500/5 to-amber-500/0 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Time</p>
                  <p className="text-2xl font-bold">
                    {avgTimeTaken > 0 ? formatTime(avgTimeTaken) : "N/A"}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Per completion
              </p>
            </div>
          </div>

          {/* Score Distribution */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Score Distribution
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-32">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">90-100%</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{
                          width: `${totalAttempts > 0 ? (perfectScores / totalAttempts) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-16 text-right">
                      {perfectScores}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-32">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">70-89%</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${totalAttempts > 0 ? (goodScores / totalAttempts) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-16 text-right">
                      {goodScores}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-32">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">50-69%</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500"
                        style={{
                          width: `${totalAttempts > 0 ? (fairScores / totalAttempts) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-16 text-right">
                      {fairScores}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-32">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Below 50%</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500"
                        style={{
                          width: `${totalAttempts > 0 ? (poorScores / totalAttempts) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-16 text-right">
                      {poorScores}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Attempts
            </h2>
            <div className="space-y-2">
              {recentSubmissions.length > 0 ? (
                recentSubmissions.map((submission) => {
                  const scorePercentage =
                    submission.total_points > 0
                      ? Math.round(
                          (submission.score / submission.total_points) * 100,
                        )
                      : 0;
                  const displayName =
                    submission.submitted_by_name ||
                    (submission.submitted_by_email
                      ? submission.submitted_by_email.split("@")[0]
                      : "Guest");
                  return (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          <Award
                            className={`h-5 w-5 ${
                              scorePercentage >= 90
                                ? "text-emerald-500"
                                : scorePercentage >= 70
                                  ? "text-blue-500"
                                  : scorePercentage >= 50
                                    ? "text-amber-500"
                                    : "text-red-500"
                            }`}
                          />
                          <span className="font-bold text-lg">
                            {scorePercentage}%
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span>
                            {submission.score} / {submission.total_points}{" "}
                            points
                          </span>
                          <div className="text-xs text-muted-foreground mt-1">
                            <span className="font-medium text-foreground">
                              {displayName}
                            </span>
                            {submission.submitted_by_email && (
                              <span className="ml-2 text-muted-foreground">
                                {submission.submitted_by_email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {submission.time_taken && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(submission.time_taken)}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(submission.submitted_at)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No submissions yet
                </p>
              )}
            </div>
          </div>

          {/* Questions List */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Questions ({questions.length})
            </h2>
            <ul className="space-y-3">
              {questions.map((question, index) => (
                <li
                  key={question.id}
                  className="p-4 rounded-lg border border-border bg-muted/30"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium mb-2">
                        {question.question_text}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="px-2 py-1 rounded-full bg-muted border border-border capitalize">
                          {question.question_type.replace("_", " ")}
                        </span>
                        <span>{question.points} points</span>
                        {question.question_options &&
                          question.question_options.length > 0 && (
                            <span>
                              {question.question_options.length} options
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-border bg-card/50">
          <Clock className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No attempts yet</h3>
          <p className="text-muted-foreground mb-6">
            Share your quiz to start receiving submissions and analytics
          </p>
          <Link
            href={`/quizzes/edit/${quiz.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            Manage Quiz
          </Link>
        </div>
      )}
    </div>
  );
}
