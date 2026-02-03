import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/quiz/[slug]/questions/[questionId] - get question (public)
// PUT /api/quiz/[slug]/questions/[questionId] - update question (authenticated, creator only)
// DELETE /api/quiz/[slug]/questions/[questionId] - delete question (authenticated, creator only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; questionId: string }> },
) {
  try {
    const { slug, questionId } = await params;
    const client = await createClient();

    // Find quiz by slug or id for backwards compatibility
    let { data: quiz } = await client
      .from("quizzes")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!quiz) {
      const result = await client
        .from("quizzes")
        .select("id")
        .eq("id", slug)
        .single();
      quiz = result.data;
    }

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const { data: question, error } = await client
      .from("questions")
      .select("*, question_options(*)")
      .eq("id", questionId)
      .eq("quiz_id", quiz.id)
      .single();

    if (error) throw error;
    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    // Public response should not expose correct answers
    const sanitizedQuestion = {
      ...question,
      question_options: question.question_options?.map((opt: any) => ({
        ...opt,
        is_correct: undefined,
      })),
    };

    return NextResponse.json(sanitizedQuestion);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch question",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; questionId: string }> },
) {
  try {
    const { slug, questionId } = await params;
    const client = await createClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find quiz by slug or id for backwards compatibility
    let { data: quiz } = await client
      .from("quizzes")
      .select("id, creator_id")
      .eq("slug", slug)
      .single();

    if (!quiz) {
      const result = await client
        .from("quizzes")
        .select("id, creator_id")
        .eq("id", slug)
        .single();
      quiz = result.data;
    }

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.creator_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { question_text, question_type, points, options } = body;

    const { data: question, error: updateError } = await client
      .from("questions")
      .update({ question_text, question_type, points })
      .eq("id", questionId)
      .select()
      .single();

    if (updateError) throw updateError;

    if (options) {
      await client
        .from("question_options")
        .delete()
        .eq("question_id", questionId);

      const optionsData = options.map((opt: any, index: number) => ({
        question_id: questionId,
        option_text: opt.option_text,
        is_correct: opt.is_correct,
        order: index + 1,
      }));

      await client.from("question_options").insert(optionsData);
    }

    const { data: fullQuestion } = await client
      .from("questions")
      .select("*, question_options(*)")
      .eq("id", questionId)
      .single();

    return NextResponse.json(fullQuestion);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update question",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; questionId: string }> },
) {
  try {
    const { slug, questionId } = await params;
    const client = await createClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find quiz by slug or id for backwards compatibility
    let { data: quiz } = await client
      .from("quizzes")
      .select("id, creator_id")
      .eq("slug", slug)
      .single();

    if (!quiz) {
      const result = await client
        .from("quizzes")
        .select("id, creator_id")
        .eq("id", slug)
        .single();
      quiz = result.data;
    }

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.creator_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await client
      .from("question_options")
      .delete()
      .eq("question_id", questionId);
    const { error } = await client
      .from("questions")
      .delete()
      .eq("id", questionId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete question",
      },
      { status: 500 },
    );
  }
}
