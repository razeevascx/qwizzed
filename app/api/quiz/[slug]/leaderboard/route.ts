import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/quiz/[slug]/leaderboard
 * Public endpoint to get leaderboard rankings for a quiz
 * Accessible by anyone (public leaderboards)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;
    const client = await createClient();

    // Get quiz first to check if it's public (try slug first, then id)
    let { data: quiz, error: quizError } = await client
      .from("quizzes")
      .select("id, visibility, is_published")
      .eq("slug", slug)
      .single();

    if (quizError || !quiz) {
      const result = await client
        .from("quizzes")
        .select("id, visibility, is_published")
        .eq("id", slug)
        .single();
      quiz = result.data;
      quizError = result.error;
    }

    if (quizError || !quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Allow access if quiz is public and published
    if (quiz.visibility !== "public" || !quiz.is_published) {
      return NextResponse.json(
        { error: "This leaderboard is not public" },
        { status: 403 },
      );
    }

    // Fetch leaderboard data from view
    const { data: leaderboard, error: leaderboardError } = await client
      .from("quiz_leaderboard")
      .select(
        "submission_id, quiz_id, submitted_by_name, submitted_by_email, score, total_points, score_percentage, rank, submitted_at",
      )
      .eq("quiz_id", quiz.id)
      .order("rank", { ascending: true })
      .limit(100);

    if (leaderboardError) throw leaderboardError;

    // Hide email addresses in public leaderboard
    const publicLeaderboard =
      leaderboard?.map((entry) => ({
        ...entry,
        submitted_by_email: entry.submitted_by_email
          ? entry.submitted_by_email.split("@")[0] + "***"
          : "Anonymous",
      })) || [];

    return NextResponse.json(publicLeaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch leaderboard",
      },
      { status: 500 },
    );
  }
}
