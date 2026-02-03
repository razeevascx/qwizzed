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

// GET /api/quiz/[id] - get quiz details with questions (public)
// PUT /api/quiz/[id] - update quiz (authenticated, creator only)
// DELETE /api/quiz/[id] - delete quiz (authenticated, creator only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const client = await createClient();

    const { data: quiz, error } = await client
      .from("quizzes")
      .select(QUIZ_FIELDS.DETAIL)
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!quiz) {
      return successResponse({ error: "Quiz not found" }, 404);
    }

    // Fetch questions for this quiz (exclude answer key from response)
    const { data: questions, error: questionsError } = await client
      .from("questions")
      .select(QUESTION_FIELDS.DISPLAY)
      .eq("quiz_id", id)
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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const client = await createClient();

    const authResult = await requireAuth(client);
    if (authResult.error) return authResult.error;

    const ownershipResult = await verifyQuizOwnership(
      client,
      id,
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
      .eq("id", id)
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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const client = await createClient();

    const authResult = await requireAuth(client);
    if (authResult.error) return authResult.error;

    const ownershipResult = await verifyQuizOwnership(
      client,
      id,
      authResult.user!.id,
    );
    if (ownershipResult.error) return ownershipResult.error;

    const { error } = await client.from("quizzes").delete().eq("id", id);

    if (error) throw error;

    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error, "Failed to delete quiz");
  }
}
