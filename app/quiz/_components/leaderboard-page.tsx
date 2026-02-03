import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QuizLeaderboard } from "@/components/quiz-leaderboard";
import Layout from "@/components/layout/Layout";
import { ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";

interface LeaderboardQuiz {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  category: string | null;
  difficulty_level: string | null;
  is_published: boolean;
  visibility: string | null;
}

export async function getLeaderboardQuiz(slugOrId: string) {
  const client = await createClient();

  let { data: quiz, error } = await client
    .from("quizzes")
    .select(
      "id, slug, title, description, category, difficulty_level, is_published, visibility",
    )
    .eq("slug", slugOrId)
    .single();

  if (error || !quiz) {
    const result = await client
      .from("quizzes")
      .select(
        "id, slug, title, description, category, difficulty_level, is_published, visibility",
      )
      .eq("id", slugOrId)
      .single();
    quiz = result.data as LeaderboardQuiz | null;
  }

  if (!quiz) {
    return null;
  }

  if (quiz.visibility !== "public" || !quiz.is_published) {
    return null;
  }

  return quiz as LeaderboardQuiz;
}

export async function LeaderboardPageContent({
  slugOrId,
}: {
  slugOrId: string;
}) {
  const quiz = await getLeaderboardQuiz(slugOrId);

  if (!quiz) {
    notFound();
  }

  const quizSlug = quiz.slug || quiz.id;

  return (
    <Layout>
      <div className="min-h-screen space-y-8 pb-16">
        <div className="max-w-4xl mx-auto w-full">
          <Link
            href={`/quiz/${quizSlug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quiz
          </Link>

          <div className="space-y-4 mb-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <h1 className="text-4xl font-bold text-foreground">
                  {quiz.title}
                </h1>
                <p className="text-muted-foreground">{quiz.description}</p>
              </div>
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {quiz.category && (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm font-medium">
                  {quiz.category}
                </span>
              )}
              {quiz.difficulty_level && (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm font-medium capitalize">
                  {quiz.difficulty_level}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Top Performers
              </h2>
              <QuizLeaderboard quizSlug={quizSlug} limit={100} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
