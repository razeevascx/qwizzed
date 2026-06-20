import { Quiz } from "@/lib/types/quiz";
import QuizzesClient from "../QuizzesClient";
import { createClient } from "@/lib/supabase/server";
import { getCachedPublicQuizzes } from "./data-service";
import { QuizService } from "@/lib/supabase/quiz-service";

async function getUser() {
  try {
    const client = await createClient();
    const {
      data: { user },
    } = await client.auth.getUser();
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
      quizzes = await QuizService.getCombinedUserQuizzes(user.id, user.email);
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

