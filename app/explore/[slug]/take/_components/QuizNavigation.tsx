"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface QuizNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  isSubmitting: boolean;
  hasAnswer: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function QuizNavigation({
  currentIndex,
  totalQuestions,
  isSubmitting,
  hasAnswer,
  onPrevious,
  onNext,
}: QuizNavigationProps) {
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="flex items-center gap-4">
      {currentIndex > 0 && (
        <Button
          variant="outline"
          size="lg"
          onClick={onPrevious}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
      )}
      <Button
        onClick={onNext}
        disabled={isSubmitting || !hasAnswer}
        size="lg"
        className="flex-1 gap-2 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            Submitting...
          </>
        ) : isLastQuestion ? (
          <>
            Submit Quiz
            <CheckCircle2 className="w-5 h-5 ml-2" />
          </>
        ) : (
          <>
            Next Question
            <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
          </>
        )}
      </Button>
    </div>
  );
}
