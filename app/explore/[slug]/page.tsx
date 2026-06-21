import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/ui/Navbar";
import { SiteFooter } from "@/components/site-footer";
import { getCachedQuizBySlug } from "../_components/data-service";
import { QuizActions } from "./QuizActions";
import { QuizLeaderboard } from "@/components/quiz-leaderboard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    let realSlug = slug;
    if (slug.includes("&action=take")) {
      realSlug = slug.replace("&action=take", "");
    } else if (slug.includes("?action=take")) {
      realSlug = slug.split("?")[0];
    }
    const quiz = await getCachedQuizBySlug(realSlug);

    if (!quiz) {
      return {
        title: "Quiz | Qwizzed",
        description: "Take an interactive quiz on Qwizzed.",
      };
    }

    return {
      title: `${quiz.title} | Qwizzed`,
      description: quiz.description || "Take an interactive quiz on Qwizzed.",
      openGraph: {
        title: quiz.title,
        description: quiz.description || "Take a quiz on Qwizzed",
        type: "website",
        images: [
          {
            url: `/explore/${realSlug}/opengraph-image`,
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
        images: [`/explore/${realSlug}/opengraph-image`],
      },
    };
  } catch {
    return {
      title: "Quiz | Qwizzed",
      description: "Take an interactive quiz on Qwizzed.",
    };
  }
}

async function PageContent({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const quiz = await getCachedQuizBySlug(slug);

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

      <div className="flex flex-wrap items-center gap-4 pt-4">
        <Button asChild size="lg" className="h-12 px-8 text-base">
          <Link href={`/explore/${slug}/take`}>Start Quiz Now</Link>
        </Button>
        <QuizActions
          slug={slug}
          quizTitle={quiz?.title || "Quiz"}
          organizerName={quiz?.organizer_name}
        />
      </div>

      <div className="border-t border-border/30 pt-12">
        <h2 className="text-2xl font-bold">Top Performers</h2>
        <QuizLeaderboard quizSlug={slug} limit={100} />
      </div>
    </section>
  );
}

export default async function Page({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const action = resolvedSearchParams?.action;

  let realSlug = slug;
  let isTakeAction = action === "take";

  if (slug.includes("&action=take")) {
    realSlug = slug.replace("&action=take", "");
    isTakeAction = true;
  } else if (slug.includes("?action=take")) {
    realSlug = slug.split("?")[0];
    isTakeAction = true;
  }

  if (isTakeAction) {
    redirect(`/explore/${realSlug}/take`);
  }

  return (
    <>
      <SiteHeader />
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <PageContent params={Promise.resolve({ slug: realSlug })} />
        </Suspense>
      </Layout>
      <SiteFooter />
    </>
  );
}
