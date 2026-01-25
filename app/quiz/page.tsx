"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, BarChart3, Clock, TrendingUp } from "lucide-react";
import { Quiz } from "@/lib/types/quiz";

export default function QuizDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    publishedQuizzes: 0,
    totalQuestions: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const client = createClient();
        const {
          data: { user },
        } = await client.auth.getUser();
        setUser(user);

        // Load quizzes
        const response = await fetch("/api/quizzes");
        if (response.ok) {
          const data = await response.json();
          setQuizzes(data);

          // Calculate stats
          const totalQuestions = data.reduce(
            (sum: number, quiz: Quiz) => sum + quiz.total_questions,
            0,
          );
          const publishedCount = data.filter(
            (q: Quiz) => q.is_published,
          ).length;

          setStats({
            totalQuizzes: data.length,
            publishedQuizzes: publishedCount,
            totalQuestions,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className=" bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Welcome back, {user?.email?.split("@")[0] || "User"}
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage your quizzes and track your performance
              </p>
            </div>
            <Button
              onClick={() => router.push("/quiz/create")}
              size="lg"
              className="gap-2 mt-2"
            >
              <Plus className="w-5 h-5" />
              Create Quiz
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Create Quiz Card */}
          <button
            onClick={() => router.push("/quiz/create")}
            className="group relative rounded-xl border border-border/60 bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden p-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left space-y-2">
                <h3 className="text-xl font-bold">Create New Quiz</h3>
                <p className="text-muted-foreground">
                  Start building a new quiz with custom questions
                </p>
              </div>
            </div>
          </button>

          {/* Browse Quizzes Card */}
          <button
            onClick={() => router.push("/quiz/my-quizzes")}
            className="group relative rounded-xl border border-border/60 bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden p-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left space-y-2">
                <h3 className="text-xl font-bold">Manage Quizzes</h3>
                <p className="text-muted-foreground">
                  Edit, publish, and manage your quiz collection
                </p>
              </div>
            </div>
          </button>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Quizzes */}
          <div className="rounded-xl border border-border/50 bg-card p-6 hover:border-primary/30 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Quizzes
                </span>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold">{stats.totalQuizzes}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  All your quizzes
                </p>
              </div>
            </div>
          </div>

          {/* Published Quizzes */}
          <div className="rounded-xl border border-border/50 bg-card p-6 hover:border-primary/30 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Published
                </span>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold">
                  {stats.publishedQuizzes}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Live quizzes
                </p>
              </div>
            </div>
          </div>

          {/* Total Questions */}
          <div className="rounded-xl border border-border/50 bg-card p-6 hover:border-primary/30 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Questions
                </span>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                  <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold">{stats.totalQuestions}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Total questions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
