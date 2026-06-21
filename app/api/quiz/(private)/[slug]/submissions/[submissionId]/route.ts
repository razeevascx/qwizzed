import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { QuizService } from "@/lib/supabase/quiz-service";

// POST /api/explore/[id]/submissions/[submissionId] - submit answer
// PUT /api/explore/[id]/submissions/[submissionId] - grade submission
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; submissionId: string }> },
) {
  try {
    const { slug, submissionId } = await params;
    const client = await createClient();

    const quiz = await QuizService.getQuiz(slug);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { answers } = body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Invalid answers format" },
        { status: 400 },
      );
    }

    // Use authenticated user's info from session
    const name =
      user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";
    const email = user.email || null;

    // ponytail: use QuizService to grade and submit answers
    const updatedSubmission = await QuizService.submitQuizAnswers(
      quiz.id,
      submissionId,
      answers,
      name,
      email
    );

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to submit answers",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; submissionId: string }> },
) {
  try {
    const { slug, submissionId } = await params;
    const client = await createClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quiz = await QuizService.getQuiz(slug);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.creator_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { status, manual_score } = body;

    // ponytail: use QuizService to grade submission
    const updatedSubmission = await QuizService.gradeQuizSubmission(
      quiz.id,
      submissionId,
      status,
      manual_score
    );

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to grade submission",
      },
      { status: 500 },
    );
  }
}
