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
  Trophy,
  Calendar,
  Layers,
  ChevronRight,
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
      gradient: "from-emerald-500 to-emerald-600",
      color: "bg-emerald-500",
    },
    medium: {
      gradient: "from-amber-500 to-amber-600",
      color: "bg-amber-500",
    },
    hard: {
      gradient: "from-rose-500 to-rose-600",
      color: "bg-rose-500",
    },
  };

  const difficulty = difficultyConfig[quiz.difficulty_level || "medium"];
  const isInvited = accessType === "invited";
  const canDelete = !isInvited && Boolean(onDelete);
  const quizPath = `/explore/${quiz.slug || quiz.id}`;

  const cardContent = (
    <div
      className={`group relative h-full bg-card border border-border/50 transition-all duration-300 flex flex-col ${
        isScheduled && !showActions
          ? "cursor-default opacity-60"
          : "cursor-pointer hover:border-foreground "
      }`}
    >
      {/* Difficulty Gradient Bar (No Rounded Borders) */}
      <div className={`h-1.5 w-full bg-linear-to-r ${difficulty.gradient}`} />

      {/* Main Content Area */}
      <div className="relative p-6 flex flex-col flex-1">
        {/* Top Row: Category & Status */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 ${difficulty.color}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70">
              {quiz.category}
            </span>
          </div>

          {isInvited && (
            <div className="bg-primary px-2 py-0.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-primary-foreground">
                Invited
              </span>
            </div>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-3 mb-8">
          <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-[1.1] uppercase tracking-tight">
            {quiz.title}
          </h3>
          {quiz.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
              {quiz.description}
            </p>
          )}
        </div>

        {/* Meta Stats Row */}
        <div className="flex items-center gap-6 mb-8 pt-6 border-t border-border/30">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
              Questions
            </p>
            <p className="text-sm font-bold text-foreground">
              {quiz.total_questions}
            </p>
          </div>
          <div className="space-y-1 border-l border-border/30 pl-6">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
              Time
            </p>
            <p className="text-sm font-bold text-foreground">
              {quiz.time_limit_minutes ? `${quiz.time_limit_minutes}m` : "∞"}
            </p>
          </div>
        </div>

        {isScheduled && (
          <div className="mt-auto pt-4 flex items-center gap-2 text-primary">
            <Calendar className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Releases in {releaseCountdown}
            </span>
          </div>
        )}

        {/* Owner Admin Badges */}
        {showActions && (
          <div className="flex flex-wrap items-center gap-3 mt-auto pt-6 border-t border-border/30">
            <div
              className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${
                quiz.is_published
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
              }`}
            >
              {quiz.is_published ? "Published" : "Draft"}
            </div>
            <div className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-muted text-muted-foreground border border-border/50">
              {quiz.visibility}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions Area (Admin) */}
      {showActions && (
        <div className="px-6 pb-6 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-9 text-[10px] font-black uppercase tracking-widest rounded-none border-border/50 hover:bg-foreground hover:text-background transition-all"
            >
              <Link href={`/dashboard/explorezes/edit/${quiz.id}`}>
                <Edit className="w-3.5 h-3.5 mr-2" />
                Edit
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-9 text-[10px] font-black uppercase tracking-widest rounded-none border-border/50 hover:bg-foreground hover:text-background transition-all"
            >
              <Link href={quizPath}>
                <Eye className="w-3.5 h-3.5 mr-2" />
                View
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-9 text-[10px] font-black uppercase tracking-widest rounded-none border-border/50 hover:bg-foreground hover:text-background transition-all"
            >
              <Link href={`/dashboard/explorezes/share/${quiz.id}`}>
                <Share2 className="w-3.5 h-3.5 mr-2" />
                Share
              </Link>
            </Button>
            {quiz.visibility === "public" && quiz.is_published ? (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-9 text-[10px] font-black uppercase tracking-widest rounded-none border-border/50 hover:bg-foreground hover:text-background transition-all"
              >
                <Link href={`/dashboard/analytics/${quiz.id}`}>
                  <Trophy className="w-3.5 h-3.5 mr-2" />
                  Scores
                </Link>
              </Button>
            ) : (
              canDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete?.(quiz.id);
                  }}
                  className="h-9 text-[10px] font-black uppercase tracking-widest rounded-none text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/20 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Delete
                </Button>
              )
            )}
          </div>
        </div>
      )}

      {/* Decorative Arrow for Clickable Cards */}
      {!showActions && !isScheduled && (
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
          <ArrowRight className="w-6 h-6 text-primary" />
        </div>
      )}
    </div>
  );

  if (showActions) {
    return cardContent;
  }

  if (isScheduled) {
    return <div className="block h-full">{cardContent}</div>;
  }

  return (
    <Link href={quizPath} className="block h-full">
      {cardContent}
    </Link>
  );
}
