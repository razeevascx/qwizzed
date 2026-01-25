import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const client = await createClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: quizzes, error } = await client
      .from("quizzes")
      .select()
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(quizzes);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch quizzes",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await createClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      difficulty_level,
      category,
      time_limit_minutes,
    } = body;

    const { data: quiz, error } = await client
      .from("quizzes")
      .insert([
        {
          creator_id: user.id,
          title,
          description,
          difficulty_level,
          category,
          time_limit_minutes,
          is_published: false,
          total_questions: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create quiz",
      },
      { status: 500 },
    );
  }
}
