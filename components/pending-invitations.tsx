"use client";

import { useEffect, useState } from "react";
import { Mail, Check, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await fetch("/api/quiz-invitations");
      if (response.ok) {
        const data = await response.json();
        setInvitations(data);
      }
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = async (
    invitationId: string,
    status: "accepted" | "declined",
  ) => {
    try {
      const response = await fetch(`/api/quiz-invitations/${invitationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      }
    } catch (error) {
      console.error("Failed to respond to invitation:", error);
    }
  };

  if (isLoading) {
    return null;
  }

  if (invitations.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-primary/50 bg-primary/5 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Mail className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">
            Quiz Invitations ({invitations.length})
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            You have pending quiz invitations
          </p>

          <div className="mt-4 space-y-3">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="rounded-lg border border-border bg-card p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium">
                      {invitation.quizzes?.title || "Quiz"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {invitation.quizzes?.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                        {invitation.quizzes?.difficulty_level}
                      </span>
                      <Link
                        href={`/quizzes/${invitation.quiz_id}`}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        View quiz
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleRespond(invitation.id, "accepted")}
                    className="flex-1 gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRespond(invitation.id, "declined")}
                    className="flex-1 gap-2"
                  >
                    <X className="h-4 w-4" />
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
