"use client";

import { Clock, Maximize2, Minimize2, LogOut } from "lucide-react";

interface QuizHeaderProps {
  title?: string;
  organizerName?: string | null;
  timeLeft: number | null;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
  onExit: () => void;
}

export function QuizHeader({
  title,
  organizerName,
  timeLeft,
  isFullscreen,
  onFullscreenToggle,
  onExit,
}: QuizHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-bold truncate max-w-md text-foreground">
          {title}
        </h1>
        {organizerName && (
          <p className="text-xs text-primary font-medium">
            Organized by {organizerName}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {timeLeft !== null && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm border ${
              timeLeft < 60
                ? "bg-destructive/10 text-destructive border-destructive/20"
                : "bg-muted/50 text-foreground border-border/50"
            }`}
          >
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        )}
        <button
          onClick={onFullscreenToggle}
          className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={onExit}
          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
          title="Exit quiz"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
