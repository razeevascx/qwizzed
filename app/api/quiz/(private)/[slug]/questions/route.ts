import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { QuizService } from "@/lib/supabase/quiz-service";

// POST /api/explore/[id]/questions - add question (authenticated)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;
    const client = await createClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ponytail: get quiz by slug or id using QuizService helper
    const quiz = await QuizService.getQuiz(slug, client);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.creator_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();

    // ponytail: use QuizService to add question instead of duplicate queries
    const question = await QuizService.addQuestion(quiz.id, body);

    const { data: fullQuestion } = await client
      .from("questions")
      .select("*, question_options(*)")
      .eq("id", question.id)
      .single();

    return NextResponse.json(fullQuestion);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to add question",
      },
      { status: 500 },
    );
  }
}
