"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Quiz } from "@/lib/types/quiz";
import { SocialShare } from "@/components/social-share";

interface QuizResultProps {
  submissionResult: any;
  questionsCount: number;
  quiz: Quiz;
  onRetake: () => void;
}

export function QuizResult({
  submissionResult,
  questionsCount,
  quiz,
  onRetake,
}: QuizResultProps) {
  const router = useRouter();

  const { scorePercentage, isPassed, timeTakenMinutes, timeTakenSeconds } =
    useMemo(() => {
      const scorePercentage = submissionResult?.total_points
        ? Math.round(
            (submissionResult.score / submissionResult.total_points) * 100,
          )
        : 0;
      const isPassed = scorePercentage >= 50;
      const timeTakenMinutes = submissionResult?.time_taken
        ? Math.floor(submissionResult.time_taken / 60)
        : 0;
      const timeTakenSeconds = submissionResult?.time_taken
        ? submissionResult.time_taken % 60
        : 0;

      return {
        scorePercentage,
        isPassed,
        timeTakenMinutes,
        timeTakenSeconds,
      };
    }, [submissionResult]);



  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-2xl w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
        {/* Main Result Card */}
        <div className="border border-dashed border-border rounded-lg p-8 md:p-12 bg-card">
          {/* Score Display */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative">
              <div
                className={`w-48 h-48 rounded-full border-[3px] border-dashed flex items-center justify-center ${
                  isPassed
                    ? "border-emerald-500/70 bg-emerald-500/5"
                    : "border-rose-500/70 bg-rose-500/5"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`text-6xl font-bold tracking-tighter ${
                      isPassed ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {scorePercentage}
                    <span className="text-4xl">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-center space-y-2 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {isPassed ? "Well Done!" : "Keep Going!"}
            </h1>
            <p className="text-muted-foreground text-base">
              {isPassed
                ? "You've successfully passed this quiz."
                : "Review the material and try again."}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8">
            <div className="border border-dashed border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-3">
                <StatCard
                  value={`${submissionResult?.score || 0}/${
                    submissionResult?.total_points || 0
                  }`}
                  label="Points"
                  className="border-r border-dashed border-border"
                />
                <StatCard
                  value={questionsCount}
                  label="Questions"
                  className="border-r border-dashed border-border"
                />
                <StatCard
                  value={
                    timeTakenMinutes > 0
                      ? `${timeTakenMinutes}m ${timeTakenSeconds}s`
                      : `${timeTakenSeconds}s`
                  }
                  label="Time"
                />
              </div>
            </div>
          </div>

          {/* Organizer */}
          {quiz?.organizer_name && (
            <div className="border border-dashed border-border rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground font-medium">
                Organized By <span className="mx-2 opacity-50">/</span>{" "}
                <span className="text-foreground font-semibold">
                  {quiz.organizer_name}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={() => router.push("/quiz")}
            size="lg"
            className="w-full h-12 rounded-lg font-medium"
          >
            Explore More Quizzes
          </Button>
          <Button
            variant="outline"
            onClick={onRetake}
            size="lg"
            className="w-full h-12 rounded-lg font-medium border-dashed"
          >
            Try Again
          </Button>
        </div>

        {/* Social Share */}
        <SocialShare
          scorePercentage={scorePercentage}
          quizTitle={quiz.title}
          organizerName={quiz.organizer_name}
          className="pt-6 border-t border-dashed border-border mt-6"
        />

      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  className = "",
}: {
  value: string | number;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`p-4 md:p-6 text-center bg-muted/30 hover:bg-muted/50 transition-colors ${className}`}
    >
      <p className="text-2xl md:text-3xl font-bold mb-1">{value}</p>
      <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-medium">
        {label}
      </p>
    </div>
  );
}
