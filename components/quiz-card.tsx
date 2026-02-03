import { Quiz } from "@/lib/types/quiz";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Edit,
  Eye,
  BookOpen,
  Clock,
  ArrowRight,
  Mail,
  Lock,
  Globe,
  Share2,
} from "lucide-react";

interface QuizCardProps {
  quiz: Quiz;
  onDelete?: (id: string) => void;
  onInvite?: (id: string) => void;
  onShare?: (id: string) => void;
  showActions?: boolean;
  accessType?: "owner" | "invited";
  invitationStatus?: "pending" | "accepted" | "declined";
}

export function QuizCard({
  quiz,
  onDelete,
  onInvite,
  onShare,
  showActions = false,
  accessType,
  invitationStatus,
}: QuizCardProps) {
  const releaseAt = quiz.release_at ? new Date(quiz.release_at) : null;
  const releaseMs = releaseAt ? releaseAt.getTime() : null;
  const isScheduled = releaseMs !== null && releaseMs > Date.now();

  const formatTimeRemaining = (ms: number) => {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const releaseCountdown =
    isScheduled && releaseMs !== null
      ? formatTimeRemaining(releaseMs - Date.now())
      : null;

  const difficultyConfig = {
    easy: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      label: "Easy",
    },
    medium: {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      label: "Medium",
    },
    hard: {
      bg: "bg-rose-500/10",
      text: "text-rose-600 dark:text-rose-400",
      label: "Hard",
    },
  };

  const difficulty = difficultyConfig[quiz.difficulty_level];
  const isInvited = accessType === "invited";
  const canDelete = !isInvited && Boolean(onDelete);

  const cardContent = (
    <div
      className={`group relative h-full rounded-lg bg-card border-2 border-border transition-all duration-200 overflow-hidden flex flex-col ${
        isScheduled && !showActions
          ? "cursor-default opacity-60"
          : "cursor-pointer hover:border-primary hover:shadow-xl hover:-translate-y-1"
      }`}
    >
      {/* Header with gradient background */}
      <div className="relative pt-6 px-6 pb-5 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {quiz.title}
            </h3>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${difficulty.bg} ${difficulty.text}`}
          >
            {difficulty.label}
          </span>
        </div>
        {quiz.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {quiz.description}
          </p>
        )}
      </div>

      {/* Invited badge */}
      {isInvited && (
        <div className="px-6 pt-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
            <Mail className="w-3 h-3" />
            Invited{invitationStatus ? ` • ${invitationStatus}` : ""}
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className={`flex flex-col flex-1 px-6 ${isInvited ? "pt-3" : "pt-4"} pb-4`}
      >
        {/* Meta info grid */}
        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-border/30">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Category
            </p>
            <p className="text-sm font-semibold text-foreground line-clamp-1">
              {quiz.category}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Questions
            </p>
            <p className="text-sm font-semibold text-foreground">
              {quiz.total_questions}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Time
            </p>
            <p className="text-sm font-semibold text-foreground">
              {quiz.time_limit_minutes ? `${quiz.time_limit_minutes}m` : "∞"}
            </p>
          </div>
        </div>

        {/* Status badges - Only show when showActions */}
        {showActions && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {quiz.is_published ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Published
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-medium border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Draft
              </span>
            )}
            {quiz.visibility && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                {quiz.visibility === "public" ? (
                  <Globe className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                {quiz.visibility === "public" ? "Public" : "Private"}
              </span>
            )}
          </div>
        )}

        <div className="flex-1" />

        {/* Footer Actions */}
        {showActions ? (
          <div className="pt-4 border-t border-border/50">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 text-xs font-medium"
              >
                <Link href={`/dashboard/quizzes/edit/${quiz.id}`}>
                  <Edit className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 text-xs font-medium"
              >
                <Link href={`/quiz/${quiz.id}`}>
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  View
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 text-xs font-medium"
              >
                <Link href={`/dashboard/quizzes/share/${quiz.id}`}>
                  <Share2 className="w-3.5 h-3.5 mr-1" />
                  Share
                </Link>
              </Button>
              {canDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete?.(quiz.id);
                  }}
                  className="h-8 text-xs font-medium text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/20"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            {releaseCountdown ? (
              <span className="text-xs text-muted-foreground font-medium">
                Releases in {releaseCountdown}
              </span>
            ) : (
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                Start Quiz
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (showActions) {
    return cardContent;
  }

  if (isScheduled) {
    return <div className="block h-full">{cardContent}</div>;
  }

  return (
    <Link href={`/quiz/${quiz.id}`} className="block h-full">
      {cardContent}
    </Link>
  );
}
