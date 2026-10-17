import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { QuizService } from "@/lib/quiz-service";
import { requireAuth } from "@/lib/api-utils";

// GET /api/explore/[slug] - get quiz details with questions (public)
// PUT /api/explore/[slug] - update quiz (authenticated, creator only)
// DELETE /api/explore/[slug] - delete quiz (authenticated, creator only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;

    const ownerOnly = request.nextUrl.searchParams.get("scope") === "owner";
    if (ownerOnly) {
      const authResult = await requireAuth();
      if (authResult.error) return authResult.error;
    }
    const quiz = ownerOnly ? await QuizService.getOwnedQuiz(slug) : await QuizService.getQuiz(slug);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const questions = await QuizService.getQuizQuestions(quiz.id);

    return NextResponse.json({
      ...quiz,
      questions: questions || [],
    }, { headers: { "Cache-Control": "private, no-store" } });
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

    const quiz = await QuizService.getQuiz(slug);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    if (quiz.creator_id !== authResult.user!.id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await request.json();
    const updatedQuiz = await QuizService.updateQuiz(quiz.id, body);

    revalidateTag(`user-quizzes-${authResult.user!.id}`, "max");
    if (quiz.visibility === "public" || body.visibility === "public") {
      revalidateTag("public-quizzes", "max");
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

    const quiz = await QuizService.getQuiz(slug);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    if (quiz.creator_id !== authResult.user!.id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await QuizService.deleteQuiz(quiz.id);

    revalidateTag(`user-quizzes-${authResult.user!.id}`, "max");
    if (quiz.visibility === "public") {
      revalidateTag("public-quizzes", "max");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete quiz";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
