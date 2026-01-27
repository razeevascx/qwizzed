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
      const response = await fetch("/api/invitations");
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
      const response = await fetch(`/api/invitations/${invitationId}`, {
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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-border/40 bg-card/60 p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-16 h-16 rounded-2xl bg-muted shrink-0" />
            <div className="flex-1 space-y-3 w-full">
               <div className="h-4 w-1/3 bg-muted rounded-full" />
               <div className="h-3 w-2/3 bg-muted/60 rounded-full" />
            </div>
            <div className="w-full md:w-48 h-10 bg-muted rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 rounded-3xl border-2 border-dashed border-border/60 bg-muted/5">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Mail className="w-10 h-10 text-primary/40" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No pending invitations</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          You're all caught up! When someone invites you to a private quiz, it will appear here.
        </p>
        <Button
          variant="outline"
          onClick={fetchInvitations}
          className="mt-8 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Check for new invites
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Pending Invitations</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {invitations.length} {invitations.length === 1 ? "invitation" : "invitations"} waiting for your response
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchInvitations}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:border-primary/40"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                  <Mail className="w-3 h-3" />
                  Invitation Received • {formatDate(invitation.invited_at)}
                </div>
                <h3 className="text-xl font-bold">{invitation.quizzes?.title || "Quiz"}</h3>
                <p className="text-muted-foreground line-clamp-2">
                  {invitation.quizzes?.description || "No description provided."}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => handleRespond(invitation.id, "accepted")}
                  disabled={respondingId === invitation.id}
                  className="px-6"
                >
                  {respondingId === invitation.id ? "Joining..." : "Accept"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRespond(invitation.id, "declined")}
                  disabled={respondingId === invitation.id}
                >
                  Decline
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
