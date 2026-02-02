import { Suspense } from "react";
import type { Metadata } from "next";
import TakeQuizClient from "./TakeQuizClient";
import type { Quiz, Question, QuestionOption } from "@/lib/types/quiz";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/quiz/${id}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return {
        title: "Quiz | Qwizzed",
        description: "Take an interactive quiz on Qwizzed.",
      };
    }

    const quiz = await res.json();

    return {
      title: `${quiz.title} | Qwizzed`,
      description: quiz.description || "Take an interactive quiz on Qwizzed.",
      openGraph: {
        title: quiz.title,
        description: quiz.description || "Take a quiz on Qwizzed",
        type: "website",
      },
    };
  } catch (error) {
    return {
      title: "Quiz | Qwizzed",
      description: "Take an interactive quiz on Qwizzed.",
    };
  }
}

type QuizWithQuestions = Quiz & {
  questions?: Array<Question & { question_options?: QuestionOption[] }>;
};

async function PageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let initialQuiz: QuizWithQuestions | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/quiz/${id}`,
      { cache: "no-store" },
    );

    if (res.ok) {
      initialQuiz = (await res.json()) as QuizWithQuestions;
    }
  } catch (error) {
    initialQuiz = null;
  }

  return <TakeQuizClient quizId={id} initialQuiz={initialQuiz} />;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <PageContent params={params} />
      </Suspense>
    </div>
  );
}
