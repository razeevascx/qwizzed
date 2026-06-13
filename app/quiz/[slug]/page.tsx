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
        images: [
          {
            url: `/quiz/${slug}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: quiz.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: quiz.title,
        description: quiz.description || "Take a quiz on Qwizzed",
        images: [`/quiz/${slug}/opengraph-image`],
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
    <section className="min-h-dvh py-24 space-y-12">
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            {quiz?.title || "Quiz"}
          </h1>
          {quiz?.description && (
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
              {quiz.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
          {quiz?.category && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-muted/50">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {quiz.category}
            </div>
          )}
          {quiz?.difficulty_level && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-muted/50 capitalize">
              {quiz.difficulty_level}
            </div>
          )}
          {typeof quiz?.total_questions === "number" && (
            <div className="px-3 py-1.5 rounded-full border border-border/50 bg-muted/50">
              {quiz.total_questions} questions
            </div>
          )}
          {quiz?.time_limit_minutes ? (
            <div className="px-3 py-1.5 rounded-full border border-border/50 bg-muted/50">
              {quiz.time_limit_minutes}m limit
            </div>
          ) : null}
          {quiz?.organizer_name ? (
            <div className="px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary">
              By {quiz.organizer_name}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 pt-4">
        <Button asChild size="lg" className="h-12 px-8 text-base">
          <Link href={`/quiz/${slug}/take`}>Start Quiz Now</Link>
        </Button>
      </div>

      <div className="border-t border-border/30 pt-12">
        <QuizTabs
          slug={slug}
          quizId={quiz?.id || ""}
          quizTitle={quiz?.title || "Quiz"}
          organizerName={quiz?.organizer_name}
        />
      </div>
    </section>
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
