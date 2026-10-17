import { NextRequest, NextResponse } from "next/server";
import { QuizService } from "@/lib/quiz-service";

/**
 * GET /api/explore/[slug]/leaderboard
 * Public endpoint to get leaderboard rankings for a quiz
 * Accessible by anyone (public leaderboards)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {

  try {
    const slug = (await params).slug;

    // ponytail: get quiz by slug or id using QuizService helper
    const quiz = await QuizService.getQuiz(slug);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Allow access if quiz is public and published
    if (quiz.visibility !== "public" || !quiz.is_published) {
      return NextResponse.json(
        { error: "This leaderboard is not public" },
        { status: 403 },
      );
    }

    const leaderboard = await QuizService.getLeaderboard(quiz.id);

    // Hide email addresses in public leaderboard
    return NextResponse.json(leaderboard);
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
