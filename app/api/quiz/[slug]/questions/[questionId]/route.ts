import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { QuizService } from "@/lib/quiz-service";

type Context = { params: Promise<{ slug: string; questionId: string }> };

export async function GET(_request: NextRequest, { params }: Context) {
  try {
    const { slug, questionId } = await params;
    const quiz = await QuizService.getQuiz(slug);
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    const question = await QuizService.getQuestion(quiz.id, questionId);
    if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });
    // Convex includes answer keys only for the verified quiz owner.
    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch question" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Context) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { slug, questionId } = await params;
    const quiz = await QuizService.getQuiz(slug);
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    if (quiz.creator_id !== user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { question_text, question_type, points, options } = await request.json();
    const question = await QuizService.updateQuestion(quiz.id, questionId, { question_text, question_type, points, options });
    revalidateTag(`quiz-${slug}`, "max");
    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update question" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { slug, questionId } = await params;
    const quiz = await QuizService.getQuiz(slug);
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    if (quiz.creator_id !== user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    await QuizService.deleteQuestion(questionId, quiz.id);
    revalidateTag(`quiz-${slug}`, "max");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to delete question" }, { status: 500 });
  }
}
