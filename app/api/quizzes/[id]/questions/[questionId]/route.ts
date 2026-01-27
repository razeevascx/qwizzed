import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> },
) {
  try {
    const { questionId } = await params;
    const client = await createClient();

    const { data: question, error } = await client
      .from("questions")
      .select("*, question_options(*)")
      .eq("id", questionId)
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

    // Verify quiz ownership
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

    // Update question details
    const { data: question, error } = await client
      .from("questions")
      .update({
        question_text,
        question_type,
        points: points || 1,
      })
      .eq("id", questionId)
      .select("*, question_options(*)")
      .single();

    if (error) throw error;

    // Handle options update if provided
    if (options && options.length > 0) {
      // 1. Get existing options to identify which ones to delete
      const { data: existingOptions } = await client
        .from("question_options")
        .select("id")
        .eq("question_id", questionId);

      const existingIds = existingOptions?.map((o) => o.id) || [];
      const updatedIds = options
        .filter((o: any) => o.id)
        .map((o: any) => o.id);

      const idsToDelete = existingIds.filter((id) => !updatedIds.includes(id));

      // 2. Delete removed options
      if (idsToDelete.length > 0) {
        await client.from("question_options").delete().in("id", idsToDelete);
      }

      // 3. Upsert current options
      const optionsToUpsert = options.map((opt: any, index: number) => ({
        id: opt.id || undefined, // Supabase will insert if id is undefined
        question_id: questionId,
        option_text: opt.option_text,
        is_correct: opt.is_correct,
        order: index + 1,
      }));

      const { error: optionsError } = await client
        .from("question_options")
        .upsert(optionsToUpsert);

      if (optionsError) throw optionsError;
    }

    // Fetch the final state
    const { data: fullQuestion } = await client
      .from("questions")
      .select("*, question_options(*)")
      .eq("id", questionId)
      .single();

    return NextResponse.json(fullQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
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

    // Verify quiz ownership
    const { data: quiz } = await client
      .from("quizzes")
      .select()
      .eq("id", id)
      .single();

    if (!quiz || quiz.creator_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { error } = await client
      .from("questions")
      .delete()
      .eq("id", questionId);

    if (error) throw error;

    // Update question count
    const { count } = await client
      .from("questions")
      .select("*", { count: "exact" })
      .eq("quiz_id", id);

    await client
      .from("quizzes")
      .update({ total_questions: count || 0 })
      .eq("id", id);

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
