import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Quiz } from "@/lib/types/quiz";
import Layout from "@/components/layout/Layout";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { QuizTabs } from "./QuizTabs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/quiz/${slug}`,
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
  } catch {
    return {
      title: "Quiz | Qwizzed",
      description: "Take an interactive quiz on Qwizzed.",
    };
  }
}

async function PageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let quiz: Quiz | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/quiz/${slug}`,
      { cache: "no-store" },
    );

    if (res.ok) {
      quiz = (await res.json()) as Quiz;
    }
  } catch {
    quiz = null;
  }

  return (
    <div className="min-h-dvh py-10 space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          {quiz?.title || "Quiz"}
        </h1>
        {quiz?.description && (
          <p className="text-muted-foreground text-lg">{quiz.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {quiz?.category && <span>{quiz.category}</span>}
          {quiz?.difficulty_level && (
            <span className="capitalize">{quiz.difficulty_level}</span>
          )}
          {typeof quiz?.total_questions === "number" && (
            <span>{quiz.total_questions} questions</span>
          )}
          {quiz?.time_limit_minutes ? (
            <span>{quiz.time_limit_minutes}m limit</span>
          ) : null}
          {quiz?.organizer_name ? <span>By {quiz.organizer_name}</span> : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href={`/quiz/${slug}/take`}>Start Quiz</Link>
        </Button>
      </div>

      <QuizTabs
        slug={slug}
        quizId={quiz?.id || ""}
        quizTitle={quiz?.title || "Quiz"}
        organizerName={quiz?.organizer_name}
      />
    </div>
  );
}

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <SiteHeader />
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <PageContent params={params} />
        </Suspense>
      </Layout>
      <SiteFooter />
    </>
  );
}
