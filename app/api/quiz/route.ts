import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revalidateTag } from "next/cache";
import { QuizService } from "@/lib/supabase/quiz-service";

export async function GET(request: NextRequest) {
  try {
    const client = await createClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    // If user is authenticated, return their own quizzes + invitations
    if (user && !userError) {
      const combined = await QuizService.getCombinedUserQuizzes(
        user.id,
        user.email,
      );
      return NextResponse.json(combined);
    }

    // If not authenticated, return public quizzes
    const quizzes = await QuizService.getPublishedQuizzes();
    return NextResponse.json(quizzes);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch quizzes",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await createClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const quiz = await QuizService.createQuiz(user.id, body);

    revalidateTag(`user-quizzes-${user.id}`);

    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create quiz",
      },
      { status: 500 },
    );
  }
}
