import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const client = await createClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    // If user is authenticated, return their own quizzes + invitations
    if (user && !userError) {
      const { data: ownedQuizzes, error: ownedError } = await client
        .from("quizzes")
        .select(
          "id, title, description, total_questions, difficulty_level, category",
        )
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });

      if (ownedError) throw ownedError;

      const { data: invitedRows, error: invitedError } = await client
        .from("quiz_invitations")
        .select(
          "status, invited_at, quiz_id, quizzes(id, title, description, total_questions, difficulty_level, category)",
        )
        .in("status", ["pending", "accepted"])
        .order("invited_at", { ascending: false });

      if (invitedError) throw invitedError;

      const invitedQuizzes = (invitedRows || [])
        .filter((row) => row.quizzes)
        .map((row) => ({
          ...row.quizzes,
          accessType: "invited" as const,
          invitationStatus: row.status,
          invited_at: row.invited_at,
        }));

      const owned = (ownedQuizzes || []).map((quiz) => ({
        ...quiz,
        accessType: "owner" as const,
      }));

      const combined = [...owned, ...invitedQuizzes].sort((a, b) => {
        const aDate = new Date(
          a.updated_at || a.invited_at || a.created_at,
        ).getTime();
        const bDate = new Date(
          b.updated_at || b.invited_at || b.created_at,
        ).getTime();
        return bDate - aDate;
      });

      return NextResponse.json(combined);
    }

    // If not authenticated, return public quizzes
    const { data: quizzes, error } = await client
      .from("quizzes")
      .select(
        "id, title, description, total_questions, difficulty_level, category",
      )
      .eq("is_published", true)
      .eq("visibility", "public")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(quizzes);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch quizzes",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await createClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      difficulty_level,
      category,
      time_limit_minutes,
      release_at,
      organizer_name,
    } = body;

    const { data: quiz, error } = await client
      .from("quizzes")
      .insert([
        {
          title,
          description,
          difficulty_level,
          category,
          time_limit_minutes,
          release_at,
          organizer_name,
          creator_id: user.id,
          is_published: false,
          visibility: "private",
          total_questions: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create quiz",
      },
      { status: 500 },
    );
  }
}
