import { QuizService, QuizWithQuestions } from "@/lib/quiz-service";
import { Quiz } from "@/lib/types/quiz";
import { cacheLife, cacheTag } from "next/cache";

export async function getCachedPublicQuizzes(): Promise<Quiz[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("public-quizzes");

  return await QuizService.getPublishedQuizzes();
}

export async function getCachedQuizBySlug(
  slug: string,
  includeQuestions: boolean = false,
): Promise<QuizWithQuestions | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(`quiz-${slug}`);

  return await QuizService.getPublicQuiz(slug, includeQuestions);
}
