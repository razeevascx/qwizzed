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
      <section className="min-h-screen py-24 space-y-12">
        <div className="max-w-4xl mx-auto w-full">
          <Link
            href={`/quiz/${quizSlug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Quiz
          </Link>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="space-y-4 flex-1">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                  {quiz.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {quiz.description}
                </p>
              </div>
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 shrink-0">
                <Trophy className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {quiz.category && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-muted/50 text-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {quiz.category}
                </span>
              )}
              {quiz.difficulty_level && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-muted/50 text-sm font-medium capitalize">
                  {quiz.difficulty_level}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full border-t border-border/30 pt-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Top Performers
              </h2>
              <QuizLeaderboard quizSlug={quizSlug} limit={100} />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
