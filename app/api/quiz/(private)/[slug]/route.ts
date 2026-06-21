import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revalidateTag } from "next/cache";
import { QuizService } from "@/lib/supabase/quiz-service";
import {
  QUIZ_FIELDS,
  QUESTION_FIELDS,
  requireAuth,
  verifyQuizOwnership,
} from "@/lib/api-utils";

// GET /api/explore/[slug] - get quiz details with questions (public)
// PUT /api/explore/[slug] - update quiz (authenticated, creator only)
// DELETE /api/explore/[slug] - delete quiz (authenticated, creator only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;
    const client = await createClient();

    const quiz = await QuizService.getQuiz(slug);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Fetch questions for this quiz (exclude answer key from response)
    const { data: questions, error: questionsError } = await client
      .from("questions")
      .select(QUESTION_FIELDS.DISPLAY)
      .eq("quiz_id", quiz.id)
      .order("order", { ascending: true });

    if (questionsError) throw questionsError;

    return NextResponse.json({
      ...quiz,
      questions: questions || [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch quiz";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const client = await createClient();

    const quiz = await QuizService.getQuiz(slug);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const authResult = await requireAuth(client);
    if (authResult.error) return authResult.error;

    const ownershipResult = await verifyQuizOwnership(
      client,
      quiz.id,
      authResult.user!.id,
    );
    if (ownershipResult.error) return ownershipResult.error;

    const body = await request.json();
    const updatedQuiz = await QuizService.updateQuiz(quiz.id, body);

    revalidateTag(`user-quizzes-${authResult.user!.id}`);
    if (quiz.visibility === "public" || body.visibility === "public") {
      revalidateTag("public-quizzes");
    }

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update quiz";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;
    const client = await createClient();

    const quiz = await QuizService.getQuiz(slug);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const authResult = await requireAuth(client);
    if (authResult.error) return authResult.error;

    const ownershipResult = await verifyQuizOwnership(
      client,
      quiz.id,
      authResult.user!.id,
    );
    if (ownershipResult.error) return ownershipResult.error;

    await QuizService.deleteQuiz(quiz.id);

    revalidateTag(`user-quizzes-${authResult.user!.id}`);
    if (quiz.visibility === "public") {
      revalidateTag("public-quizzes");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete quiz";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
