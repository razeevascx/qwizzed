import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/quiz/[id]/submissions - get quiz submissions (creator only)
// POST /api/quiz/[id]/submissions - create submission (taking quiz)
export async function GET(
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

    // Check if user is the quiz creator
    const { data: quiz } = await client
      .from("quizzes")
      .select("creator_id")
      .eq("id", id)
      .single();

    if (!quiz || quiz.creator_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

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

    const { data: quiz } = await client
      .from("quizzes")
      .select("id, visibility, creator_id")
      .eq("id", id)
      .single();

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const email = user.email;
    if (email) {
      await client
        .from("quiz_invitations")
        .update({
          status: "accepted",
          invitee_id: user.id,
          responded_at: new Date().toISOString(),
        })
        .eq("quiz_id", id)
        .eq("invitee_email", email)
        .eq("status", "pending");
    }

    const submittedByName =
      (user.user_metadata?.full_name as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      (email ? email.split("@")[0] : "Guest");

    const { data: submission, error: submissionError } = await client
      .from("quiz_submissions")
      .insert([
        {
          quiz_id: id,
          user_id: user.id,
          status: "in_progress",
          score: 0,
          total_points: 0,
          submitted_by_email: email || null,
          submitted_by_name: submittedByName,
        },
      ])
      .select()
      .single();

    if (submissionError) {
      return NextResponse.json(
        {
          error: "You don't have permission to take this quiz.",
          details: submissionError.message,
        },
        { status: 403 },
      );
    }

    return NextResponse.json(submission);
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
