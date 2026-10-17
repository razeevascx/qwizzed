import { getCurrentUser } from "@/lib/auth";
import { Quiz } from "@/lib/types/quiz";
import QuizzesClient from "../QuizzesClient";
import { getCachedPublicQuizzes } from "./data-service";
import { QuizService } from "@/lib/quiz-service";

async function getUser() {
  try {

    const user = await getCurrentUser();
    return user;
  } catch {
    return null;
  }
}

export default async function QuizzesDataLoader() {
  const user = await getUser();

  let quizzes: Quiz[] = [];
  if (user) {
    try {
      quizzes = await QuizService.getCombinedUserQuizzes();
    } catch (error) {
      console.error("Error fetching user quizzes:", error);
      // Fallback to public quizzes if combined fetch fails
      quizzes = await getCachedPublicQuizzes();
    }
  } else {
    quizzes = await getCachedPublicQuizzes();
  }

  return (
    <QuizzesClient
      initialPublicQuizzes={quizzes}
      user={user ? { id: user.id, email: user.email } : null}
    />
  );
}

