import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { QuizService } from "@/lib/quiz-service";

// GET /api/explore/[id]/submissions - get quiz submissions (creator only)
// POST /api/explore/[id]/submissions - create submission (taking quiz)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {

  try {
    const slug = (await params).slug;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quiz = await QuizService.getQuiz(slug);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.creator_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const submissions = await QuizService.getSubmissions(quiz.id);

    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch submissions",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quiz = await QuizService.getQuiz(slug);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const submission = await QuizService.createQuizSubmission(quiz.id);

    return NextResponse.json(submission);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create submission",
      },
      { status: 500 },
    );
  }
}
