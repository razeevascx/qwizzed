import { createClient as createStaticClient } from "@/lib/supabase/client";
import { QuizService, QuizWithQuestions } from "@/lib/supabase/quiz-service";
import { Quiz } from "@/lib/types/quiz";
import { cacheLife, cacheTag } from "next/cache";

export async function getCachedPublicQuizzes(): Promise<Quiz[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("public-quizzes");

  const client = createStaticClient();
  return await QuizService.getPublishedQuizzes(client);
}

export async function getCachedQuizBySlug(
  slug: string,
  includeQuestions: boolean = false,
): Promise<QuizWithQuestions | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(`quiz-${slug}`);

  const client = createStaticClient();
  return await QuizService.getQuiz(slug, client, includeQuestions);
}
