"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Invitation {
  id: string;
  invitee_email: string;
  status: "pending" | "accepted" | "declined";
  invited_at: string;
  responded_at: string | null;
}

interface QuizInvitationsListProps {
  quizId: string;
}

export function QuizInvitationsList({ quizId }: QuizInvitationsListProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, [quizId]);

  const fetchInvitations = async () => {
    try {
      const response = await fetch(`/api/invitations?quiz_id=${quizId}`);
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

  const handleDelete = async (invitationId: string) => {
    if (!confirm("Are you sure you want to delete this invitation?")) return;

    try {
      const response = await fetch(`/api/invitations/${invitationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      }
    } catch (error) {
      console.error("Failed to delete invitation:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "declined":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-amber-500/10 text-amber-500",
      accepted: "bg-emerald-500/10 text-emerald-500",
      declined: "bg-red-500/10 text-red-500",
    };

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${styles[status as keyof typeof styles]}`}
      >
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Loading invitations...</p>
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          No invitations sent yet
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">Invitations ({invitations.length})</h3>
      </div>
      <div className="divide-y divide-border">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="flex items-center justify-between p-4 transition hover:bg-muted/30"
          >
            <div className="flex-1">
              <p className="font-medium">{invitation.invitee_email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Invited {new Date(invitation.invited_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(invitation.status)}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(invitation.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
