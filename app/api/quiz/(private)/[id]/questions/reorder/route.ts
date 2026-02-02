import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PUT /api/quiz/[id]/questions/reorder - reorder questions
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const client = await createClient();

    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: quiz, error: quizError } = await client
      .from("quizzes")
      .select()
      .eq("id", id)
      .single();

    if (quizError) {
      console.error("Quiz lookup error:", quizError, { id, userId: user.id });
    }

    if (!quiz || quiz.creator_id !== user.id) {
      return NextResponse.json(
        {
          error: "Quiz not found or unauthorized",
          details: quizError?.message,
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
          .eq("quiz_id", id),
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
