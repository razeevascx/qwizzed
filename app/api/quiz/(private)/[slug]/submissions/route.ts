import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { QuizService } from "@/lib/supabase/quiz-service";

// GET /api/explore/[id]/submissions - get quiz submissions (creator only)
// POST /api/explore/[id]/submissions - create submission (taking quiz)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const client = await createClient();
  try {
    const slug = (await params).slug;
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

    const { data: submissions, error } = await client
      .from("quiz_submissions")
      .select("*")
      .eq("quiz_id", quiz.id)
      .order("submitted_at", { ascending: false });

    if (error) throw error;

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

    const email = user.email;

    const submittedByName =
      (user.user_metadata?.full_name as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      (email ? email.split("@")[0] : "Guest");

    // ponytail: use QuizService to create submission & accept invitations
    const submission = await QuizService.createQuizSubmission(
      quiz.id,
      user.id,
      email,
      submittedByName
    );

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
