import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const client = await createClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's email
    const userEmail = user.email;

    // Get all invitations for this user
    const { data: invitations, error } = await client
      .from("quiz_invitations")
      .select("*, quizzes(*)")
      .eq("invitee_email", userEmail)
      .order("invited_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(invitations || []);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch invitations",
      },
      { status: 500 },
    );
  }
}
