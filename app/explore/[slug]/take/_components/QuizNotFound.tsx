"use client";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function QuizNotFound() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
          <BookOpen className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <p className="text-xl font-semibold">Quiz Not Found</p>
          <p className="text-muted-foreground">
            The quiz you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => router.push("/explore")} className="min-w-40">
          Browse Quizzes
        </Button>
      </div>
    </div>
  );
}
