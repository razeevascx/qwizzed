import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { QuizService } from "@/lib/quiz-service";

export async function GET(request: NextRequest) {

  try {
    const user = await getCurrentUser();

    // Dashboard management lists contain only quizzes owned by this user.
    if (user) {
      const combined = await QuizService.getUserQuizzes();
      return NextResponse.json(combined, { headers: { "Cache-Control": "private, no-store" } });
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

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const quiz = await QuizService.createQuiz(body);

    revalidateTag(`user-quizzes-${user.id}`, "max");

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
