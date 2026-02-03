/**
 * API utility functions for common patterns
 */

import { NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Quiz field selection for different contexts
 */
export const QUIZ_FIELDS = {
  LIST: "id, title, description, total_questions, difficulty_level, category",
  DETAIL:
    "id, title, description, total_questions, difficulty_level, category, time_limit_minutes, release_at, organizer_name",
  WITH_CREATOR:
    "id, title, description, total_questions, difficulty_level, category, creator_id",
  FULL: "id, title, description, total_questions, difficulty_level, category, creator_id, is_published, visibility, organizer_name, time_limit_minutes, release_at, created_at",
} as const;

/**
 * Question field selection
 */
export const QUESTION_FIELDS = {
  DISPLAY:
    "id, question_text, question_type, points, question_options(id, option_text)",
  FULL: "*, question_options(*)",
  ADMIN:
    "id, question_text, question_type, points, order, quiz_id, question_options(*)",
} as const;

/**
 * Check if user is authenticated and return user, or send error response
 */
export async function requireAuth(client: SupabaseClient) {
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();

  if (userError || !user) {
    return {
      user: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { user, error: null };
}

/**
 * Verify quiz ownership and return quiz or error response
 */
export async function verifyQuizOwnership(
  client: SupabaseClient,
  quizId: string,
  userId: string,
  fields: string = QUIZ_FIELDS.WITH_CREATOR,
) {
  const { data: quiz, error } = await client
    .from("quizzes")
    .select(fields)
    .eq("id", quizId)
    .single();

  if (error) {
    throw error;
  }

  if (!quiz || (quiz as any).creator_id !== userId) {
    return {
      quiz: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 403 }),
    };
  }

  return { quiz, error: null };
}

/**
 * Generic error response handler
 */
export function errorResponse(error: unknown, defaultMessage: string) {
  const message = error instanceof Error ? error.message : defaultMessage;
  return NextResponse.json({ error: message }, { status: 500 });
}

/**
 * Success response wrapper
 */
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}
