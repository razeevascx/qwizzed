import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const client = await createClient();

    const { data: quizzes, error } = await client
      .from("quizzes")
      .select()
      .eq("is_published", true)
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
