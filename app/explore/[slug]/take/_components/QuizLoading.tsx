"use client";

import { Clock } from "lucide-react";

export function QuizLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 animate-pulse">
          <Clock className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold">Loading quiz...</p>
          <p className="text-sm text-muted-foreground">
            Please wait while we prepare your quiz
          </p>
        </div>
      </div>
    </div>
  );
}
