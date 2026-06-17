import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revalidateTag } from "next/cache";
import { QuizService } from "@/lib/supabase/quiz-service";
import {
  QUIZ_FIELDS,
  QUESTION_FIELDS,
  requireAuth,
  verifyQuizOwnership,
  errorResponse,
  successResponse,
} from "@/lib/api-utils";

// GET /api/quiz/[slug] - get quiz details with questions (public)
// PUT /api/quiz/[slug] - update quiz (authenticated, creator only)
// DELETE /api/quiz/[slug] - delete quiz (authenticated, creator only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;
    const client = await createClient();

    const quiz = await QuizService.getQuiz(slug);

    if (!quiz) {
      return successResponse({ error: "Quiz not found" }, 404);
    }

    // Fetch questions for this quiz (exclude answer key from response)
    const { data: questions, error: questionsError } = await client
      .from("questions")
      .select(QUESTION_FIELDS.DISPLAY)
      .eq("quiz_id", quiz.id)
      .order("order", { ascending: true });

    if (questionsError) throw questionsError;

    return successResponse({
      ...quiz,
      questions: questions || [],
    });
  } catch (error) {
    return errorResponse(error, "Failed to fetch quiz");
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
      return errorResponse("Quiz not found", "Quiz not found");
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

    return successResponse(updatedQuiz);
  } catch (error) {
    return errorResponse(error, "Failed to update quiz");
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
      return errorResponse("Quiz not found", "Quiz not found");
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

    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error, "Failed to delete quiz");
  }
}
