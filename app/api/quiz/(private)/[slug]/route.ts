import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

    // Try to find by slug first, then by id for backwards compatibility
    let { data: quiz, error } = await client
      .from("quizzes")
      .select(QUIZ_FIELDS.DETAIL)
      .eq("slug", slug)
      .single();

    // If not found by slug, try by id
    if (error || !quiz) {
      const result = await client
        .from("quizzes")
        .select(QUIZ_FIELDS.DETAIL)
        .eq("id", slug)
        .single();
      quiz = result.data;
      error = result.error;
    }

    if (error) throw error;
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

    // Find quiz by slug or id
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
    const {
      title,
      description,
      difficulty_level,
      category,
      time_limit_minutes,
      release_at,
      is_published,
      visibility,
      organizer_name,
    } = body;

    const updateData: any = {
      title,
      description,
      difficulty_level,
      category,
      time_limit_minutes,
      release_at,
      organizer_name,
      is_published,
    };

    if (visibility !== undefined) {
      updateData.visibility = visibility;
    }

    const { data: updatedQuiz, error } = await client
      .from("quizzes")
      .update(updateData)
      .eq("id", quiz.id)
      .select()
      .single();

    if (error) throw error;

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

    const { error } = await client.from("quizzes").delete().eq("id", quiz.id);

    if (error) throw error;

    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error, "Failed to delete quiz");
  }
}
