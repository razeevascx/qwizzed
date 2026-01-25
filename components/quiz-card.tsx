import { Quiz } from "@/lib/types/quiz";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Edit,
  Eye,
  BookOpen,
  Clock,
  Zap,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

interface QuizCardProps {
  quiz: Quiz;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export function QuizCard({
  quiz,
  onDelete,
  showActions = false,
}: QuizCardProps) {
  const difficultyConfig = {
    easy: {
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      text: "text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-200 dark:border-emerald-800",
      label: "Easy",
    },
    medium: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-800",
      label: "Medium",
    },
    hard: {
      bg: "bg-rose-50 dark:bg-rose-950/30",
      text: "text-rose-700 dark:text-rose-300",
      border: "border-rose-200 dark:border-rose-800",
      label: "Hard",
    },
  };

  const difficulty = difficultyConfig[quiz.difficulty_level];

  return (
    <Link href={showActions ? "#" : `/quiz/take/${quiz.id}`}>
      <div className="group relative h-full rounded-2xl border border-border/50 bg-card hover:bg-card/80 hover:border-primary/40 hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer flex flex-col">
        {/* Gradient accent bar at top */}
        <div className="h-1 bg-gradient-to-r from-primary/50 via-primary/30 to-transparent group-hover:from-primary/60 transition-all" />

        <div className="relative p-6 flex flex-col h-full">
          {/* Header with Title and Difficulty */}
          <div className="space-y-3 mb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {quiz.title}
                </h3>
              </div>
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 ${difficulty.bg} ${difficulty.text}`}
              >
                {difficulty.label}
              </span>
            </div>
            {quiz.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {quiz.description}
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-border/30">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">
                  Questions
                </span>
              </div>
              <p className="text-sm font-bold text-foreground">
                {quiz.total_questions}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">
                  Category
                </span>
              </div>
              <p className="text-sm font-bold text-foreground line-clamp-1">
                {quiz.category}
              </p>
            </div>
            {quiz.time_limit_minutes && (
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Time
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {quiz.time_limit_minutes}m
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Published Status */}
          {quiz.is_published && (
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 w-fit">
              <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              Published
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          {showActions ? (
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/30">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full gap-1.5 text-xs h-9 hover:border-primary/40"
                title="Edit quiz"
              >
                <Link href={`/quiz/edit/${quiz.id}`}>
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full gap-1.5 text-xs h-9 hover:border-primary/40"
                title="Preview quiz"
              >
                <Link href={`/quiz/take/${quiz.id}`}>
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete?.(quiz.id);
                }}
                className="w-full gap-1.5 text-xs h-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                title="Delete quiz"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-4 border-t border-border/30 group-hover:border-primary/40 transition-colors">
              <span className="text-sm font-semibold text-foreground">
                Take Quiz
              </span>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-all duration-300" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
