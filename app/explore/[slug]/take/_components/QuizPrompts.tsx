"use client";

import { Button } from "@/components/ui/button";

interface QuizPromptsProps {
  showLoginPrompt: boolean;
  showExitConfirm: boolean;
  onRedirectToLogin: () => void;
  onCancelExit: () => void;
  onConfirmExit: () => void;
}

export function QuizPrompts({
  showLoginPrompt,
  showExitConfirm,
  onRedirectToLogin,
  onCancelExit,
  onConfirmExit,
}: QuizPromptsProps) {
  return (
    <>
      {showLoginPrompt && (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold">
                Sign in to submit your answers
              </p>
              <p className="text-xs text-muted-foreground">
                We saved your answers. Sign in to submit and see results.
              </p>
            </div>
            <Button onClick={onRedirectToLogin} className="w-full sm:w-auto">
              Sign in to submit
            </Button>
          </div>
        </div>
      )}

      {showExitConfirm && (
        <div className="rounded-xl border border-amber-200/40 bg-amber-50 dark:bg-amber-950/20 p-4 sm:p-5">
          <div className="flex flex-col gap-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                Exit quiz?
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-200">
                You have unsaved answers. They will be lost if you exit
                without submitting.
              </p>
            </div>
            <div className="flex gap-3 sm:flex-row-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancelExit}
                className="flex-1 sm:flex-none"
              >
                Continue Quiz
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onConfirmExit}
                className="flex-1 sm:flex-none"
              >
                Exit Without Saving
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
