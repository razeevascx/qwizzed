"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";

interface QuizStats {
  totalQuizzes: number;
  publishedQuizzes: number;
  totalSubmissions: number;
  totalUsers: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<QuizStats>({
    totalQuizzes: 0,
    publishedQuizzes: 0,
    totalSubmissions: 0,
    totalUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // Fetch actual quiz statistics
        const response = await fetch("/api/quiz");
        if (!response.ok) throw new Error("Failed to fetch quizzes");

        const quizzes = await response.json();

        // Calculate stats from the quizzes
        const totalQuizzes = quizzes.length;
        const publishedQuizzes = quizzes.filter(
          (q: any) => q.is_published,
        ).length;

        // Fetch submission stats
        let totalSubmissions = 0;
        let uniqueUsersSet = new Set();

        for (const quiz of quizzes) {
          try {
            const submissionsRes = await fetch(
              `/api/quiz/${quiz.id}/submissions`,
            );
            if (submissionsRes.ok) {
              const submissions = await submissionsRes.json();
              totalSubmissions += submissions.length;
              submissions.forEach((sub: any) => {
                if (sub.user_id) uniqueUsersSet.add(sub.user_id);
                else if (sub.submitted_by_email)
                  uniqueUsersSet.add(sub.submitted_by_email);
              });
            }
          } catch (err) {
            // Skip if submissions endpoint fails for a quiz
            console.error(`Failed to fetch submissions for quiz ${quiz.id}`);
          }
        }

        setStats({
          totalQuizzes,
          publishedQuizzes,
          totalSubmissions,
          totalUsers: uniqueUsersSet.size,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Set default values on error
        setStats({
          totalQuizzes: 0,
          publishedQuizzes: 0,
          totalSubmissions: 0,
          totalUsers: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      icon: Plus,
      label: "Create Quiz",
      description: "Build a new quiz from scratch",
      href: "/dashboard/create",
    },
    {
      icon: BookOpen,
      label: "My Quizzes",
      description: "Manage your existing quizzes",
      href: "/dashboard/quizzes",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      description: "View quiz performance and insights",
      href: "/dashboard/analytics",
    },
    {
      icon: Users,
      label: "Invitations",
      description: "Manage quiz invitations",
      href: "/dashboard/invitations",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Welcome to Qwizzed Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Create, manage, and track your quizzes all in one place
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-border/60 p-6 space-y-3 animate-pulse"
              >
                <div className="w-12 h-12 rounded-lg bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-8 w-16 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard
              icon={BookOpen}
              label="Total Quizzes"
              value={stats.totalQuizzes}
              color="blue"
            />
            <StatCard
              icon={TrendingUp}
              label="Published"
              value={stats.publishedQuizzes}
              color="green"
            />
            <StatCard
              icon={BarChart3}
              label="Total Submissions"
              value={stats.totalSubmissions}
              color="purple"
            />
            <StatCard
              icon={Users}
              label="Active Users"
              value={stats.totalUsers}
              color="orange"
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Quick Actions</h2>
          <p className="text-muted-foreground">
            Get started with these common tasks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group rounded-lg border border-border/60 p-6 transition-all hover:border-primary hover:bg-muted/5 hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="rounded-lg bg-primary/10 p-3 text-primary group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {action.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: "blue" | "green" | "purple" | "orange";
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400",
    purple:
      "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400",
    orange:
      "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400",
  };

  return (
    <div className="rounded-lg border border-border/60 p-6 space-y-3">
      <div className={`w-fit rounded-lg p-3 ${colorClasses[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}
