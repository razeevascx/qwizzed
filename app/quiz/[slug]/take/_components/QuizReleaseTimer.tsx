"use client";

import { Clock } from "lucide-react";
import Layout from "@/components/layout/Layout";

interface QuizReleaseTimerProps {
  releaseTimeLeft: number;
}

export function QuizReleaseTimer({ releaseTimeLeft }: QuizReleaseTimerProps) {
  function formatReleaseCountdown(seconds: number) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m ${secs}s`;
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg w-full rounded-2xl border border-border bg-card p-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10">
            <Clock className="w-7 h-7 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Quiz releases soon</h2>
            <p className="text-muted-foreground">
              This quiz will be available in
            </p>
          </div>
          <div className="text-3xl font-bold text-primary">
            {formatReleaseCountdown(releaseTimeLeft)}
          </div>
        </div>
      </div>
    </Layout>
  );
}
