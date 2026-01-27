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
      pointsEarned = isCorrect ? question.points || 1 : 0;
    } else {
      pointsEarned = 0;
    }

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

    const { data: submission, error: submissionError } = await client
      .from("quiz_submissions")
      .select()
      .eq("id", submissionId)
      .eq("user_id", user.id)
      .single();

    if (submissionError || !submission) {
      return NextResponse.json(
        { error: "Submission not found or unauthorized" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { answers: batchAnswers } = body;

    if (batchAnswers && Array.isArray(batchAnswers)) {
      const answersToInsert = batchAnswers.map((ans: any) => ({
        submission_id: submissionId,
        question_id: ans.question_id,
        user_answer: ans.user_answer,
      }));

      const { data: questions } = await client
        .from("questions")
        .select("*, question_options(*)")
        .eq("quiz_id", quizId);

      const inserts = answersToInsert.map((ans: any) => {
        const q = questions?.find((q) => q.id === ans.question_id);
        let isCorrect = false;
        let pointsEarned = 0;

        if (
          q &&
          (q.question_type === "multiple_choice" ||
            q.question_type === "true_false")
        ) {
          const correctOption = q.question_options.find(
            (opt: any) => opt.is_correct,
          );
          isCorrect = correctOption && correctOption.id === ans.user_answer;
          pointsEarned = isCorrect ? q.points || 1 : 0;
        }

        return {
          ...ans,
          is_correct: isCorrect,
          points_earned: pointsEarned,
        };
      });

      const { error: batchError } = await client
        .from("quiz_answers")
        .insert(inserts);

      if (batchError) {
        throw new Error("Failed to save quiz results");
      }
    }

    const { data: answers, error: answersError } = await client
      .from("quiz_answers")
      .select("*")
      .eq("submission_id", submissionId);

    if (answersError) {
      return NextResponse.json(
        { error: "Failed to fetch final results" },
        { status: 500 },
      );
    }

    const { data: allQuestions, error: questionsError } = await client
      .from("questions")
      .select("id, points")
      .eq("quiz_id", quizId);

    if (questionsError) {
      return NextResponse.json(
        { error: `Failed to fetch questions: ${questionsError.message}` },
        { status: 500 },
      );
    }

    const totalPoints =
      allQuestions?.reduce((sum, q) => sum + (q.points || 1), 0) || 0;

    const score =
      answers?.reduce((sum, ans) => sum + (ans.points_earned || 0), 0) || 0;

    const startTime = submission.created_at
      ? new Date(submission.created_at).getTime()
      : null;
    const endTime = Date.now();
    const timeTaken = startTime
      ? Math.round((endTime - startTime) / 1000)
      : null;

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
