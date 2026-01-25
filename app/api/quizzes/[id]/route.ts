import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const client = await createClient();

    const { data: quiz, error } = await client
      .from("quizzes")
      .select()
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch quiz",
      },
      { status: 500 },
    );
  }
}

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

    // Verify ownership
    const { data: quiz } = await client
      .from("quizzes")
      .select()
      .eq("id", id)
      .single();

    if (!quiz || quiz.creator_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      difficulty_level,
      category,
      time_limit_minutes,
      is_published,
      visibility,
    } = body;

    const updateData: any = {
      title,
      description,
      difficulty_level,
      category,
      time_limit_minutes,
      is_published,
    };

    // Only include visibility if it's provided
    if (visibility !== undefined) {
      updateData.visibility = visibility;
    }

    const { data: updatedQuiz, error } = await client
      .from("quizzes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update quiz",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
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

    // Verify ownership
    const { data: quiz } = await client
      .from("quizzes")
      .select()
      .eq("id", id)
      .single();

    if (!quiz || quiz.creator_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { error } = await client.from("quizzes").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete quiz",
      },
      { status: 500 },
    );
  }
}
