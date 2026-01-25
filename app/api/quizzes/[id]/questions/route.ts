import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const client = await createClient();

    const { data: questions, error } = await client
      .from("questions")
      .select("*, question_options(*)")
      .eq("quiz_id", id)
      .order("order", { ascending: true });

    if (error) throw error;

    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch questions",
      },
      { status: 500 },
    );
  }
}

export async function POST(
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

    // Get current question count
    const { count } = await client
      .from("questions")
      .select("*", { count: "exact" })
      .eq("quiz_id", id);

    const order = (count || 0) + 1;

    const { data: question, error } = await client
      .from("questions")
      .insert([
        {
          quiz_id: id,
          question_text,
          question_type,
          points: points || 1,
          order,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Add options if provided
    if (options && options.length > 0) {
      const optionsData = options.map((opt: any, index: number) => ({
        question_id: question.id,
        option_text: opt.option_text,
        is_correct: opt.is_correct,
        order: index + 1,
      }));

      await client.from("question_options").insert(optionsData);
    }

    // Update quiz question count
    await client
      .from("quizzes")
      .update({ total_questions: order })
      .eq("id", id);

    const { data: fullQuestion } = await client
      .from("questions")
      .select("*, question_options(*)")
      .eq("id", question.id)
      .single();

    return NextResponse.json(fullQuestion, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create question",
      },
      { status: 500 },
    );
  }
}
