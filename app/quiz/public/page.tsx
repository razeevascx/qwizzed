"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { QuizCard } from "@/components/quiz-card";
import type { Quiz } from "@/lib/types/quiz";

interface PublicQuiz {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
  visibility: "public" | "private";
  total_attempts: number;
  unique_users: number;
  average_score: number | null;
  question_count: number;
  created_at: string;
}

const toQuiz = (quiz: PublicQuiz): Quiz => ({
  id: quiz.id,
  title: quiz.title,
  description: quiz.description,
  creator_id: "",
  created_at: quiz.created_at,
  updated_at: quiz.created_at,
  is_published: quiz.is_published,
  visibility: quiz.visibility,
  total_questions: quiz.question_count ?? 0,
  time_limit_minutes: null,
  difficulty_level: "easy",
  category: "General",
});

export default function PublicQuizzesPage() {
  const [quizzes, setQuizzes] = useState<PublicQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/quizzes/published");

        if (!response.ok) {
          throw new Error("Failed to fetch public quizzes");
        }

        const data = await response.json();
        setQuizzes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Public Quizzes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Explore and take publicly available quizzes
          </p>
        </div>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-semibold transition hover:bg-muted/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search quizzes by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            <span className="font-semibold">Error:</span> {error}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredQuizzes.length === 0 && (
        <div className="rounded-lg border border-border/40 bg-card/50 p-12 text-center">
          <p className="text-muted-foreground mb-2">
            {searchTerm
              ? "No quizzes match your search."
              : "No public quizzes available yet."}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-sm text-primary hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Quiz Grid */}
      {!loading && !error && filteredQuizzes.length > 0 && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={toQuiz(quiz)} />
          ))}
        </div>
      )}

      {/* Results Count */}
      {!loading && !error && filteredQuizzes.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredQuizzes.length} of {quizzes.length} quiz
          {quizzes.length !== 1 ? "zes" : ""}
        </div>
      )}
    </div>
  );
}
