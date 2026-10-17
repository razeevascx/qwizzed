"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LeaderboardEntry } from "@/lib/types/quiz";
import { Trophy, Medal } from "lucide-react";

interface QuizLeaderboardProps {
  quizId?: string;
  quizSlug?: string;
  limit?: number;
}

export function QuizLeaderboard({
  quizId,
  quizSlug,
  limit = 50,
}: QuizLeaderboardProps) {
  const quizIdentifier = quizSlug || quizId;
  const entries = useQuery(api.submissions.leaderboard, quizIdentifier ? { quizId: quizIdentifier } : "skip");
  const leaderboard = (entries?.slice(0, limit) || []) as unknown as LeaderboardEntry[];
  const isLoading = Boolean(quizIdentifier) && entries === undefined;
  const error = quizIdentifier ? null : "Quiz identifier is missing";

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-600" />;
      default:
        return (
          <span className="text-sm font-bold text-muted-foreground w-5 text-center">
            #{rank}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-border/40 bg-card/50 p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border/40 bg-card/50 p-6 text-center text-muted-foreground">
        {error}
      </div>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="rounded-lg border border-border/40 bg-card/50 p-8 text-center">
        <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground">No submissions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {leaderboard.map((entry) => (
        <div
          key={entry.submission_id}
          className={`flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors ${
            entry.rank === 1
              ? "border-yellow-500/30 bg-yellow-500/5"
              : entry.rank === 2
                ? "border-gray-400/30 bg-gray-400/5"
                : entry.rank === 3
                  ? "border-orange-600/30 bg-orange-600/5"
                  : "border-border/40 bg-card/50 hover:bg-card"
          }`}
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center justify-center w-8">
              {getRankMedal(entry.rank)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">
                {entry.submitted_by_name ||
                 entry.submitted_by_email ||
                 (entry.user_id ? `User ${entry.user_id.slice(0, 8)}` : "Anonymous")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {entry.score}/{entry.total_points}
              </span>
              <span
                className={`text-sm font-bold ${
                  entry.score_percentage >= 80
                    ? "text-green-600"
                    : entry.score_percentage >= 60
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {entry.score_percentage}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
