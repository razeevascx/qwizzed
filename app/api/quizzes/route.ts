import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const client = await createClient();
    const adminClient = createAdminClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: ownedQuizzes, error: ownedError } = await client
      .from("quizzes")
      .select()
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });

    if (ownedError) throw ownedError;

    const email = user.email;

    const { data: invitedRows, error: invitedError } = await adminClient
      .from("quiz_invitations")
      .select("status, invited_at, quiz_id, quizzes(*)")
      .or(`invitee_email.eq.${email},invitee_id.eq.${user.id}`)
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

    // Combine and sort by updated time or invite time to surface newest first
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
      visibility = "public",
    } = body;

    const { data: quiz, error } = await client
      .from("quizzes")
      .insert([
        {
          creator_id: user.id,
          title,
          description,
          difficulty_level,
          category,
          time_limit_minutes,
          is_published: false,
          total_questions: 0,
          visibility,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Database error creating quiz:", error);
      throw error;
    }

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create quiz",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
