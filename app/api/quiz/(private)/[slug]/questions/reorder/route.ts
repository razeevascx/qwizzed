import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { QuizService } from "@/lib/quiz-service";

// PUT /api/explore/[id]/questions/reorder - reorder questions
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;


    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ponytail: get quiz by slug or id using QuizService helper
    const quiz = await QuizService.getQuiz(slug);

    if (!quiz || quiz.creator_id !== user.id) {
      return NextResponse.json(
        {
          error: "Quiz not found or unauthorized",
        },
        { status: 404 },
      );
    }

    const { questions } = await request.json();

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    await QuizService.reorderQuestions(quiz.id, questions);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to reorder questions",
      },
      { status: 500 },
    );
  }
}
