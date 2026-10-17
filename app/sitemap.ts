import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getCachedPublicQuizzes } from "@/app/explore/_components/data-service";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/explore`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const quizzes = await getCachedPublicQuizzes();
  const quizPages: MetadataRoute.Sitemap = quizzes.map((quiz) => ({
    url: `${siteUrl}/explore/${quiz.slug || quiz.id}`,
    lastModified: quiz.updated_at ? new Date(quiz.updated_at) : undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...quizPages];
}
