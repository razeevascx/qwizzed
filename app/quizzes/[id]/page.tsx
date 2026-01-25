import { Suspense } from "react";
import type { Metadata } from "next";
import TakeQuizClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/quizzes/${id}`,
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

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <h1>Blog Post</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {params.then(({ id }) => (
          <TakeQuizClient quizId={id} />
        ))}
      </Suspense>
    </div>
  );
}
