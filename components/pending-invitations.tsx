"use client";

import { useEffect, useState } from "react";
import { Mail, Check, X, ExternalLink, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Invitation {
  id: string;
  quiz_id: string;
  invitee_email: string;
  status: "pending" | "accepted" | "declined";
  invited_at: string;
  quizzes?: {
    title: string;
    description: string;
    difficulty_level: string;
  };
}

export function PendingInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const formatDate = (value: string) => {
    const date = new Date(value);
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  useEffect(() => {
    void fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/quiz-invitations");
      if (response.ok) {
        const data = await response.json();
        setInvitations(data);
        setError(null);
      } else if (response.status === 404) {
        // Treat 404 as no pending invites without surfacing an error
        setInvitations([]);
        setError(null);
      } else {
        const body = await response.json().catch(() => null);
        setError(body?.error || "Could not load invitations.");
      }
    } catch (err) {
      console.error("Failed to fetch invitations:", err);
      setError("Could not load invitations.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = async (
    invitationId: string,
    status: "accepted" | "declined",
  ) => {
    try {
      setRespondingId(invitationId);
      const response = await fetch(`/api/quiz-invitations/${invitationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
        setError(null);
        return;
      }

      if (response.status === 404) {
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
        // Treat as already handled; avoid sticky error state
        setError(null);
        return;
      }

      const body = await response.json().catch(() => null);
      setError(body?.error || "Failed to respond to invitation.");
    } catch (err) {
      console.error("Failed to respond to invitation:", err);
      setError("Failed to respond to invitation.");
    } finally {
      setRespondingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/30">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-40 rounded-full bg-muted" />
            <div className="h-3 w-56 rounded-full bg-muted/70" />
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {[0, 1].map((key) => (
            <div
              key={key}
              className="rounded-xl border border-border/60 bg-card/70 p-4"
            >
              <div className="h-4 w-48 rounded-full bg-muted" />
              <div className="mt-2 h-3 w-full rounded-full bg-muted/70" />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="h-9 rounded-lg bg-muted" />
                <div className="h-9 rounded-lg bg-muted/70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const showPanel = invitations.length > 0 || error;
  if (!showPanel) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/30">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                Quiz invitations
              </h3>
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary ring-1 ring-primary/30">
                {invitations.length} pending
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Each invite is personal to you—join before it expires.
            </p>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={fetchInvitations}
          className="inline-flex items-center gap-2 text-primary hover:bg-primary/10"
        >
          <RotateCcw className="h-4 w-4" />
          Reload
        </Button>
      </div>

      <div className="mt-5 space-y-3">
        {invitations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 bg-card/70 p-4 text-sm text-muted-foreground">
            No pending invitations.{" "}
            {error ? "Tap reload if you expected one." : ""}
          </div>
        ) : (
          invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="relative overflow-hidden rounded-xl border border-border/70 bg-card/70 p-4 transition hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                      Pending
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                      Invited {formatDate(invitation.invited_at)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      {invitation.quizzes?.title || "Quiz"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {invitation.quizzes?.description ||
                        "No description provided."}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-foreground">
                    <span className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-primary/30">
                      {invitation.quizzes?.difficulty_level || "Unrated"}
                    </span>
                    <Link
                      href={`/${invitation.quiz_id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition hover:text-primary/80"
                    >
                      View quiz
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="grid w-full grid-cols-1 gap-2 md:w-64">
                  <Button
                    size="sm"
                    onClick={() => handleRespond(invitation.id, "accepted")}
                    className="w-full justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                    disabled={respondingId === invitation.id}
                  >
                    <Check className="h-4 w-4" />
                    {respondingId === invitation.id ? "Working..." : "Accept"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRespond(invitation.id, "declined")}
                    className="w-full justify-center gap-2 border-border bg-transparent text-foreground hover:border-destructive/60 hover:text-destructive disabled:opacity-60"
                    disabled={respondingId === invitation.id}
                  >
                    <X className="h-4 w-4" />
                    {respondingId === invitation.id ? "Working..." : "Decline"}
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
