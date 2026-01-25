import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const client = await createClient();

    const { data: submissions, error } = await client
      .from("quiz_submissions")
      .select("*")
      .eq("quiz_id", id)
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

    // Check if quiz exists and is published
    const { data: quiz } = await client
      .from("quizzes")
      .select()
      .eq("id", id)
      .single();

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Create submission
    const { data: submission, error } = await client
      .from("quiz_submissions")
      .insert([
        {
          quiz_id: id,
          user_id: user.id,
          status: "in_progress",
          score: 0,
          total_points: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(submission, { status: 201 });
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
