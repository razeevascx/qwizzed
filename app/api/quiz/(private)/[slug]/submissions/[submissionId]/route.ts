import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/quiz/[id]/submissions/[submissionId] - submit answer
// PUT /api/quiz/[id]/submissions/[submissionId] - grade submission
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; submissionId: string }> },
) {
  try {
    const { slug, submissionId } = await params;
    const client = await createClient();

    // Find quiz by slug or id for backwards compatibility
    let { data: quiz } = await client
      .from("quizzes")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!quiz) {
      const result = await client
        .from("quizzes")
        .select("id")
        .eq("id", slug)
        .single();
      quiz = result.data;
    }

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { answers } = body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Invalid answers format" },
        { status: 400 },
      );
    }

    // Use authenticated user's info from session
    const name =
      user.user_metadata?.name || user.email?.split("@")[0] || "User";
    const email = user.email;

    if (!email) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 },
      );
    }

    // Process all answers and save them - calculate points in backend only
    for (const answer of answers) {
      const { question_id, user_answer } = answer;

      const { data: question, error: qError } = await client
        .from("questions")
        .select("*, question_options(*)")
        .eq("id", question_id)
        .eq("quiz_id", quiz.id)
        .single();

      if (qError || !question) {
        return NextResponse.json(
          { error: "Question not found" },
          { status: 404 },
        );
      }

      let pointsEarned = 0;
      const correctOptions = question.question_options.filter(
        (opt: any) => opt.is_correct,
      );

      // Calculate correct answer in backend only
      if (question.question_type === "multiple_choice") {
        const selectedIds = Array.isArray(user_answer)
          ? user_answer
          : [user_answer];
        const correctIds = correctOptions.map((opt: any) => opt.id);

        if (
          selectedIds.length === correctIds.length &&
          selectedIds.every((id: string) => correctIds.includes(id))
        ) {
          pointsEarned = question.points || 0;
        }
      } else if (question.question_type === "true_false") {
        const isCorrect = user_answer === correctOptions[0]?.id;
        if (isCorrect) {
          pointsEarned = question.points || 0;
        }
      } else if (
        question.question_type === "short_answer" ||
        question.question_type === "fill_in_blank"
      ) {
        const normalizedUserAnswer = (user_answer || "").toLowerCase().trim();
        const isCorrect = correctOptions.some(
          (opt: any) =>
            opt.option_text.toLowerCase().trim() === normalizedUserAnswer,
        );
        if (isCorrect) {
          pointsEarned = question.points || 0;
        }
      }

      // Save the answer to database
      const { error: saveError } = await client.from("quiz_answers").upsert({
        submission_id: submissionId,
        question_id: question_id,
        user_answer: Array.isArray(user_answer)
          ? JSON.stringify(user_answer)
          : user_answer,
        points_earned: pointsEarned,
      });

      if (saveError) throw saveError;
    }

    // Update submission with calculated score and user info
    const { data: allAnswers, error: answersError } = await client
      .from("quiz_answers")
      .select("points_earned")
      .eq("submission_id", submissionId);

    if (answersError) throw answersError;

    const totalScore = allAnswers.reduce(
      (sum: number, ans: any) => sum + (ans.points_earned || 0),
      0,
    );

    const { data: questions } = await client
      .from("questions")
      .select("points")
      .eq("quiz_id", quiz.id);

    const totalPoints = (questions || []).reduce(
      (sum: number, q: any) => sum + (q.points || 1),
      0,
    );

    const currentTime = new Date();
    const submittedAt = currentTime.toISOString();

    const { data: submission } = await client
      .from("quiz_submissions")
      .select("created_at")
      .eq("id", submissionId)
      .single();

    let timeTaken = 0;
    if (submission?.created_at) {
      const createdTime = new Date(submission.created_at).getTime();
      const currentTimeMs = currentTime.getTime();
      timeTaken = Math.floor((currentTimeMs - createdTime) / 1000);
    }

    const { data: updatedSubmission, error: updateError } = await client
      .from("quiz_submissions")
      .update({
        score: totalScore,
        total_points: totalPoints,
        time_taken: timeTaken,
        submitted_by_name: name,
        submitted_by_email: email,
        submitted_at: submittedAt,
        status: "submitted",
      })
      .eq("id", submissionId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to submit answers",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; submissionId: string }> },
) {
  try {
    const { slug, submissionId } = await params;
    const client = await createClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find quiz by slug or id for backwards compatibility
    let { data: quiz } = await client
      .from("quizzes")
      .select("id, creator_id")
      .eq("slug", slug)
      .single();

    if (!quiz) {
      const result = await client
        .from("quizzes")
        .select("id, creator_id")
        .eq("id", slug)
        .single();
      quiz = result.data;
    }

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (!quiz || quiz.creator_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { status, manual_score } = body;

    const { data: submission, error: subError } = await client
      .from("quiz_submissions")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (subError || !submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    const { data: answers } = await client
      .from("quiz_answers")
      .select("*")
      .eq("submission_id", submissionId);

    const totalScore = (answers || []).reduce(
      (sum, answer) => sum + (answer.points_earned || 0),
      0,
    );

    const { data: questions } = await client
      .from("questions")
      .select("points")
      .eq("quiz_id", quiz.id);

    const totalPoints = (questions || []).reduce(
      (sum, q) => sum + (q.points || 1),
      0,
    );

    const { data: updatedSubmission, error: updateError } = await client
      .from("quiz_submissions")
      .update({
        status: status || "completed",
        score: manual_score !== undefined ? manual_score : totalScore,
        total_points: totalPoints,
        submitted_at: new Date().toISOString(),
      })
      .eq("id", submissionId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to grade submission",
      },
      { status: 500 },
    );
  }
}
