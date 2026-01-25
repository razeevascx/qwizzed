import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; submissionId: string }> },
) {
  try {
    const { submissionId } = await params;
    const client = await createClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { question_id, user_answer } = body;

    // Verify submission ownership
    const { data: submission } = await client
      .from("quiz_submissions")
      .select()
      .eq("id", submissionId)
      .eq("user_id", user.id)
      .single();

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    // Get question and check answer
    const { data: question } = await client
      .from("questions")
      .select("*, question_options(*)")
      .eq("id", question_id)
      .single();

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    let isCorrect = false;
    let pointsEarned = 0;

    if (
      question.question_type === "multiple_choice" ||
      question.question_type === "true_false"
    ) {
      const correctOption = question.question_options.find(
        (opt: any) => opt.is_correct,
      );
      isCorrect = correctOption && correctOption.id === user_answer;
      pointsEarned = isCorrect ? 1 : 0;
    } else {
      // For short answer, mark as submitted (manual grading)
      pointsEarned = 0;
    }

    // Save answer
    const { data: answer, error } = await client
      .from("quiz_answers")
      .insert([
        {
          submission_id: submissionId,
          question_id,
          user_answer,
          is_correct: isCorrect,
          points_earned: pointsEarned,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to save answer",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; submissionId: string }> },
) {
  try {
    const { submissionId } = await params;
    const client = await createClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify submission ownership
    const { data: submission, error: submissionError } = await client
      .from("quiz_submissions")
      .select()
      .eq("id", submissionId)
      .eq("user_id", user.id)
      .single();

    if (submissionError || !submission) {
      console.error("Submission lookup error:", submissionError);
      return NextResponse.json(
        { error: "Submission not found or unauthorized" },
        { status: 404 },
      );
    }

    // Calculate score
    const { data: answers, error: answersError } = await client
      .from("quiz_answers")
      .select()
      .eq("submission_id", submissionId);

    if (answersError) {
      console.error("Error fetching answers:", answersError);
      return NextResponse.json(
        { error: "Failed to fetch answers" },
        { status: 500 },
      );
    }

    const score =
      answers?.reduce((sum, ans) => sum + (ans.points_earned || 0), 0) || 0;
    const totalPoints = answers?.length || 0;

    // Update submission
    const { data: updatedSubmission, error } = await client
      .from("quiz_submissions")
      .update({
        status: "submitted",
        score,
        total_points: totalPoints,
        submitted_at: new Date().toISOString(),
      })
      .eq("id", submissionId)
      .select()
      .single();

    if (error) {
      console.error("Error updating submission:", error);
      throw error;
    }

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to submit quiz",
      },
      { status: 500 },
    );
  }
}
