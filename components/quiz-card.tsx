"use client";

import { useState } from "react";
import type { Quiz } from "@/lib/types/quiz";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Calendar, Clock, Edit, Eye, Globe, Lock, Mail, Share2, Trash2, Trophy, User } from "lucide-react";

interface QuizCardProps {
  quiz: Quiz;
  onDelete?: (id: string) => void;
  onInvite?: (id: string) => void;
  onShare?: (id: string) => void;
  showActions?: boolean;
  accessType?: "owner" | "invited";
  invitationStatus?: "pending" | "accepted" | "declined";
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const releaseFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
const difficultyStyles = {
  easy: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  medium: "bg-amber-500/10 text-amber-800 dark:text-amber-300",
  hard: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

export function QuizCard({ quiz, onDelete, showActions = false, accessType, invitationStatus }: QuizCardProps) {
  const [now] = useState(Date.now);
  const canManage = showActions && accessType === "owner";
  const releaseAt = quiz.release_at ? new Date(quiz.release_at) : null;
  const isScheduled = Boolean(releaseAt && releaseAt.getTime() > now);
  const createdAt = new Date(quiz.created_at);
  const updatedAt = new Date(quiz.updated_at);
  const difficulty = quiz.difficulty_level || "medium";
  const quizPath = `/explore/${quiz.slug || quiz.id}`;
  const isPrivate = quiz.visibility === "private";
  const VisibilityIcon = isPrivate ? Lock : Globe;

  const card = (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm transition-colors hover:border-primary/40">
      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="secondary" className="max-w-full truncate rounded-md bg-muted/70 px-2.5 py-1 font-medium">
            {quiz.category?.trim() || "Uncategorized"}
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="line-clamp-2 break-words text-xl font-semibold leading-snug tracking-tight text-foreground" title={quiz.title}>
            {quiz.title}
          </h3>
          <p className="line-clamp-3 min-h-[3.75rem] text-sm leading-5 text-muted-foreground">
            {quiz.description?.trim() || "No description added yet."}
          </p>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-border/60 rounded-lg border border-border/50 bg-muted/25 p-3">
          <div className="space-y-1 px-2 first:pl-0">
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><BookOpen aria-hidden="true" className="size-3.5 shrink-0" />Questions</dt>
            <dd className="pl-5 text-base font-semibold tabular-nums">{quiz.total_questions}</dd>
          </div>
          <div className="space-y-1 px-2">
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock aria-hidden="true" className="size-3.5 shrink-0" />Time limit</dt>
            <dd className="pl-5 text-base font-semibold tabular-nums">{quiz.time_limit_minutes ? `${quiz.time_limit_minutes} min` : "No limit"}</dd>
          </div>
          <div className="space-y-1 px-2">
            <dt className="text-xs text-muted-foreground">Difficulty</dt>
            <dd><span className={`inline-flex rounded px-2 py-0.5 text-sm font-medium capitalize ${difficultyStyles[difficulty]}`}>{difficulty}</span></dd>
          </div>
        </dl>

        <div className="mt-auto space-y-2 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5"><VisibilityIcon aria-hidden="true" className="size-3.5" />{isPrivate ? "Private" : "Public"}</span>
            {canManage && !Number.isNaN(updatedAt.getTime()) ? <time dateTime={quiz.updated_at}>Updated {dateFormat.format(updatedAt)}</time> : !Number.isNaN(createdAt.getTime()) ? <time dateTime={quiz.created_at}>Added {dateFormat.format(createdAt)}</time> : null}
          </div>
          {quiz.organizer_name && <p className="flex items-center gap-1.5"><User aria-hidden="true" className="size-3.5 shrink-0" /><span className="truncate">By {quiz.organizer_name}</span></p>}
          {accessType === "invited" && <p className="flex items-center gap-1.5 text-primary"><Mail aria-hidden="true" className="size-3.5" />{invitationStatus === "accepted" ? "Invitation accepted" : "You’re invited"}</p>}
        </div>

        {isScheduled && releaseAt && (
          <p className="flex items-start gap-2 rounded-lg bg-primary/5 p-3 text-xs leading-5 text-primary">
            <Calendar aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>Opens <time dateTime={releaseAt.toISOString()}>{releaseFormat.format(releaseAt)} UTC</time></span>
          </p>
        )}
      </div>

      {canManage ? (
        <div className="space-y-3 border-t border-border/60 px-5 py-4 sm:px-6">
          <div className="grid grid-cols-2 gap-2">
            <Button asChild size="sm"><Link href={`/app/quizzes/edit/${quiz.id}`}><Edit aria-hidden="true" />Edit quiz</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href={quizPath}><Eye aria-hidden="true" />View quiz</Link></Button>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <Button asChild size="sm" variant="ghost" className="px-2"><Link href={`/app/quizzes/share/${quiz.id}`}><Share2 aria-hidden="true" />Share</Link></Button>
            {quiz.is_published && quiz.visibility === "public" && <Button asChild size="sm" variant="ghost" className="px-2"><Link href={`/app/analytics/${quiz.id}`}><Trophy aria-hidden="true" />Scores</Link></Button>}
            {onDelete && <Button size="sm" variant="ghost" className="ml-auto px-2 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(quiz.id)}><Trash2 aria-hidden="true" />Delete</Button>}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between border-t border-border/60 px-5 py-4 text-sm font-medium sm:px-6">
          <span className={isScheduled ? "text-muted-foreground" : "text-primary"}>{isScheduled ? "Coming soon" : "View quiz"}</span>
          {!isScheduled && <ArrowRight aria-hidden="true" className="size-4 text-primary transition-transform group-hover:translate-x-1" />}
        </div>
      )}
    </article>
  );

  return canManage || isScheduled ? card : <Link href={quizPath} className="block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">{card}</Link>;
}
