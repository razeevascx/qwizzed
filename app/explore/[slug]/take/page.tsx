import { Suspense } from "react";
import type { Metadata } from "next";
import TakeQuizClient from "./TakeQuizClient";
import { getCachedQuizBySlug } from "../../_components/data-service";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const quiz = await getCachedQuizBySlug(slug);

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
            url: `/explore/${slug}/opengraph-image`,
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
        images: [`/explore/${slug}/opengraph-image`],
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
  const quiz = await getCachedQuizBySlug(slug, true);

  return <TakeQuizClient quizId={slug} initialQuiz={quiz} />;
}

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <PageContent params={params} />
      </Suspense>

  );
}
