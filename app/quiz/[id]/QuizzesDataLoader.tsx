import { Quiz } from "@/lib/types/quiz";
import QuizzesClient from "../QuizzesClient";
import { createClient } from "@/lib/supabase/server";

async function getPublicQuizzes(): Promise<Quiz[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/quiz`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Error fetching public quizzes:", response.statusText);
      return [];
    }

    return await response.json();
  } catch (err) {
    console.error("Failed to fetch public quizzes:", err);
    return [];
  }
}

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
  const [publicQuizzes, user] = await Promise.all([
    getPublicQuizzes(),
    getUser(),
  ]);

  return (
    <QuizzesClient
      initialPublicQuizzes={publicQuizzes}
      user={user ? { id: user.id, email: user.email } : null}
    />
  );
}
