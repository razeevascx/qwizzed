import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { QuizService } from "@/lib/supabase/quiz-service";

// PUT /api/explore/[id]/questions/reorder - reorder questions
export async function PUT(
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

    // ponytail: get quiz by slug or id using QuizService helper
    const quiz = await QuizService.getQuiz(slug, client);

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

    const updates = await Promise.all(
      questions.map((q) =>
        client
          .from("questions")
          .update({ order: q.order })
          .eq("id", q.id)
          .eq("quiz_id", quiz.id),
      ),
    );

    for (const { error } of updates) {
      if (error) throw error;
    }

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
