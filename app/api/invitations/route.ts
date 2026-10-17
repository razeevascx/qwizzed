import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { QuizService } from "@/lib/quiz-service";

export async function POST(request: Request) {
  try {

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { quiz_id, invitee_email } = body;

    if (!quiz_id || !invitee_email) {
      return NextResponse.json(
        { error: "quiz_id and invitee_email are required" },
        { status: 400 },
      );
    }

    const invitation = await QuizService.inviteUserToQuiz({
      quiz_id,
      invitee_email,
    });

    return NextResponse.json(invitation, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to invite user" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {

  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get("quiz_id");

    if (quizId) {
      const invitations = await QuizService.getQuizInvitations(quizId);
      return NextResponse.json(invitations);
    } else {
      const invitations = await QuizService.getUserInvitations();
      return NextResponse.json(invitations);
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch invitations" },
      { status: 500 },
    );
  }
}
