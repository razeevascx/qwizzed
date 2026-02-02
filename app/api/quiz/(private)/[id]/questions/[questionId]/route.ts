import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/quiz/[id]/questions/[questionId] - get question
// PUT /api/quiz/[id]/questions/[questionId] - update question
// DELETE /api/quiz/[id]/questions/[questionId] - delete question
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> },
) {
  try {
    const { id, questionId } = await params;
    const client = await createClient();

    const { data: question, error } = await client
      .from("questions")
      .select("*, question_options(*)")
      .eq("id", questionId)
      .eq("quiz_id", id)
      .single();

    if (error) throw error;
    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(question);
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
  { params }: { params: Promise<{ id: string; questionId: string }> },
) {
  try {
    const { id, questionId } = await params;
    const client = await createClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: quiz } = await client
      .from("quizzes")
      .select()
      .eq("id", id)
      .single();

    if (!quiz || quiz.creator_id !== user.id) {
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
  { params }: { params: Promise<{ id: string; questionId: string }> },
) {
  try {
    const { id, questionId } = await params;
    const client = await createClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: quiz } = await client
      .from("quizzes")
      .select()
      .eq("id", id)
      .single();

    if (!quiz || quiz.creator_id !== user.id) {
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
