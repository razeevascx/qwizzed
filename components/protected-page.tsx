import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { QuizService } from "@/lib/quiz-service";

type ProtectedPageProps = {
  children: React.ReactNode;
  quizParams?: Promise<{ id: string }>;
};

async function AuthorizedContent({ children, quizParams }: ProtectedPageProps) {
  await auth.protect();
  if (quizParams && !await QuizService.getOwnedQuiz((await quizParams).id)) notFound();
  return children;
}

export function ProtectedPage({ children, quizParams }: ProtectedPageProps) {
  return <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}>
    <AuthorizedContent quizParams={quizParams}>{children}</AuthorizedContent>
  </Suspense>;
}
