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
      pointsEarned = isCorrect ? (question.points || 1) : 0;
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
    const { submissionId, id: quizId } = await params;
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

    const body = await request.json();
    const { answers: batchAnswers } = body;

    // Use admin client if we need to bypass any potential RLS delays but prefer standard for safety
    // For now, standard is fine because user owns the submission.

    // 2. Batch save answers if provided
    if (batchAnswers && Array.isArray(batchAnswers)) {
      const answersToInsert = batchAnswers.map((ans: any) => ({
        submission_id: submissionId,
        question_id: ans.question_id,
        user_answer: ans.user_answer,
        // We'll calculate correctness during fetch to maintain consistency
      }));

      // For multiple choice, we need to determine points_earned before inserting
      // Fetch all questions for this quiz
      const { data: questions } = await client
        .from("questions")
        .select("*, question_options(*)")
        .eq("quiz_id", quizId);

      const inserts = answersToInsert.map((ans: any) => {
        const q = questions?.find(q => q.id === ans.question_id);
        let isCorrect = false;
        let pointsEarned = 0;

        if (q && (q.question_type === "multiple_choice" || q.question_type === "true_false")) {
          const correctOption = q.question_options.find((opt: any) => opt.is_correct);
          isCorrect = correctOption && correctOption.id === ans.user_answer;
          pointsEarned = isCorrect ? (q.points || 1) : 0;
        }

        return {
          ...ans,
          is_correct: isCorrect,
          points_earned: pointsEarned
        };
      });

      const { error: batchError } = await client
        .from("quiz_answers")
        .insert(inserts);

      if (batchError) {
        console.error("Batch save error:", batchError);
        throw new Error("Failed to save quiz results");
      }
    }

    // 3. Get all answers (refetch to ensure we have batch + any previous)
    const { data: answers, error: answersError } = await client
      .from("quiz_answers")
      .select("*")
      .eq("submission_id", submissionId);

    if (answersError) {
      console.error("Error fetching answers:", answersError);
      return NextResponse.json(
        { error: "Failed to fetch final results" },
        { status: 500 },
      );
    }

    // Get all questions for the quiz to calculate total points
    const { data: allQuestions, error: questionsError } = await client
      .from("questions")
      .select("id, points")
      .eq("quiz_id", quizId);

    if (questionsError) {
      console.error("Error fetching questions:", questionsError);
      console.error("Quiz ID:", quizId);
      console.error("User ID:", user.id);
      return NextResponse.json(
        { error: `Failed to fetch questions: ${questionsError.message}` },
        { status: 500 },
      );
    }

    // Calculate total possible points
    const totalPoints =
      allQuestions?.reduce((sum, q) => sum + (q.points || 1), 0) || 0;

    // Calculate score from correct answers
    const score =
      answers?.reduce((sum, ans) => sum + (ans.points_earned || 0), 0) || 0;

    // Calculate time taken (if start time was recorded)
    const startTime = submission.created_at
      ? new Date(submission.created_at).getTime()
      : null;
    const endTime = Date.now();
    const timeTaken = startTime
      ? Math.round((endTime - startTime) / 1000)
      : null;

    // Update submission with final results
    const { data: updatedSubmission, error } = await client
      .from("quiz_submissions")
      .update({
        status: "graded",
        score,
        total_points: totalPoints,
        time_taken: timeTaken,
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
