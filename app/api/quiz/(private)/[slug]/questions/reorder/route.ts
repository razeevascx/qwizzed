import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PUT /api/quiz/[id]/questions/reorder - reorder questions
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

    // Find quiz by slug or id for backwards compatibility
    let { data: quiz, error: quizError } = await client
      .from("quizzes")
      .select("id, creator_id")
      .eq("slug", slug)
      .single();

    if (quizError || !quiz) {
      const result = await client
        .from("quizzes")
        .select("id, creator_id")
        .eq("id", slug)
        .single();
      quiz = result.data;
      quizError = result.error;
    }

    if (quizError) {
      console.error("Quiz lookup error:", quizError, { slug, userId: user.id });
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
