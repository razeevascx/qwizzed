import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/dashboard/leaderboard
 * Global leaderboard showing top users across all public quizzes
 */
export async function GET(request: NextRequest) {
  const client = await createClient();
  try {

    // Fetch all submissions for public and published quizzes
    // We group by user_id to get total points across all quizzes
    const { data: submissions, error } = await client
      .from("quiz_submissions")
      .select(`
        user_id,
        score,
        total_points,
        submitted_by_name,
        submitted_by_email,
        quizzes!inner(visibility, is_published)
      `)
      .eq("quizzes.visibility", "public")
      .eq("quizzes.is_published", true)
      .in("status", ["submitted", "graded"]);

    if (error) throw error;

    // Aggregate data by user
    const userStats = (submissions || []).reduce((acc: any, sub: any) => {
      const userId = sub.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          user_id: userId,
          name: sub.submitted_by_name || "Anonymous",
          email: sub.submitted_by_email,
          total_score: 0,
          total_possible: 0,
          quizzes_taken: 0,
        };
      }
      acc[userId].total_score += sub.score || 0;
      acc[userId].total_possible += sub.total_points || 0;
      acc[userId].quizzes_taken += 1;
      return acc;
    }, {});

    // Convert to array and calculate percentage
    const leaderboard = Object.values(userStats)
      .map((user: any) => ({
        ...user,
        score_percentage: user.total_possible > 0 
          ? Math.round((user.total_score / user.total_possible) * 100) 
          : 0,
        // Hide email for privacy
        email: user.email ? user.email.split("@")[0] + "***" : "Anonymous",
      }))
      .sort((a: any, b: any) => b.total_score - a.total_score || b.score_percentage - a.score_percentage)
      .slice(0, 100)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Global leaderboard error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch leaderboard",
      },
      { status: 500 }
    );
  }
}
