import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { QuizService } from "@/lib/supabase/quiz-service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    const invitation = await QuizService.respondToInvitation(id, status);
    return NextResponse.json(invitation);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to respond to invitation" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await QuizService.deleteInvitation(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete invitation" },
      { status: 500 },
    );
  }
}
