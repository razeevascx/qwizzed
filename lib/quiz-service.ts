import "server-only";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";
import { convexOptions } from "@/lib/convex";
import type { Quiz, Question, QuestionOption, QuizSubmission, QuizInvitation, CreateQuizInput, CreateQuestionInput, UpdateQuizInput, InviteUserInput } from "@/lib/types/quiz";

export interface QuestionWithOptions extends Question { question_options?: QuestionOption[] }
export type QuizWithQuestions = Quiz & { questions?: QuestionWithOptions[] };

export class QuizService {
  static async createQuiz(data: CreateQuizInput): Promise<Quiz> {
    return await fetchMutation(api.quizzes.create, data, await convexOptions()) as Quiz;
  }
  static async getQuiz(id: string, includeQuestions = false): Promise<QuizWithQuestions | null> {
    return await fetchQuery(api.quizzes.get, { id, includeQuestions }, await convexOptions()) as QuizWithQuestions | null;
  }
  static async getOwnedQuiz(id: string, includeQuestions = false): Promise<QuizWithQuestions | null> {
    return await fetchQuery(api.quizzes.owned, { id, includeQuestions }, await convexOptions()) as QuizWithQuestions | null;
  }
  static async getPublicQuiz(id: string, includeQuestions = false): Promise<QuizWithQuestions | null> {
    return await fetchQuery(api.quizzes.get, { id, includeQuestions }) as QuizWithQuestions | null;
  }
  static async getPublishedQuizzes(): Promise<Quiz[]> {
    return await fetchQuery(api.quizzes.list, { scope: "public" }) as Quiz[];
  }
  static async getUserQuizzes(): Promise<Quiz[]> {
    return await fetchQuery(api.quizzes.list, { scope: "mine" }, await convexOptions()) as Quiz[];
  }
  static async getCombinedUserQuizzes(): Promise<Quiz[]> {
    return await fetchQuery(api.quizzes.list, { scope: "accessible" }, await convexOptions()) as Quiz[];
  }
  static async updateQuiz(id: string, data: UpdateQuizInput): Promise<Quiz> {
    const { title, description, difficulty_level, category, time_limit_minutes, visibility, organizer_name, is_published } = data;
    const release_at = "release_at" in data ? data.release_at : data.scheduled_at;
    return await fetchMutation(api.quizzes.update, { id, fields: { title, description, difficulty_level, category, time_limit_minutes, release_at, visibility, organizer_name, is_published } }, await convexOptions()) as Quiz;
  }
  static async deleteQuiz(id: string) { await fetchMutation(api.quizzes.remove, { id }, await convexOptions()); }
  static async getQuizQuestions(quizId: string): Promise<QuestionWithOptions[]> {
    return await fetchQuery(api.quizzes.questions, { quizId }, await convexOptions()) as QuestionWithOptions[];
  }
  static async getQuestion(quizId: string, id: string) { return (await this.getQuizQuestions(quizId)).find((question) => question.id === id) || null; }
  static async addQuestion(quizId: string, data: CreateQuestionInput): Promise<QuestionWithOptions> {
    return await fetchMutation(api.quizzes.saveQuestion, { quizId, ...data, options: data.options?.map(({ option_text, is_correct }) => ({ option_text, is_correct })) }, await convexOptions()) as QuestionWithOptions;
  }
  static async updateQuestion(quizId: string, id: string, data: CreateQuestionInput): Promise<QuestionWithOptions> {
    return await fetchMutation(api.quizzes.saveQuestion, { quizId, id, ...data, options: data.options?.map(({ option_text, is_correct }) => ({ option_text, is_correct })) }, await convexOptions()) as QuestionWithOptions;
  }
  static async deleteQuestion(id: string, quizId: string) { await fetchMutation(api.quizzes.removeQuestion, { id, quizId }, await convexOptions()); }
  static async reorderQuestions(quizId: string, questions: { id: string; order: number }[]) { await fetchMutation(api.quizzes.reorder, { quizId, questions }, await convexOptions()); }
  static async getSubmissions(quizId?: string): Promise<QuizSubmission[]> {
    return await fetchQuery(api.submissions.list, { quizId }, await convexOptions()) as unknown as QuizSubmission[];
  }
  static async getSubmission(id: string): Promise<QuizSubmission | null> {
    return await fetchQuery(api.submissions.get, { id }, await convexOptions()) as unknown as QuizSubmission | null;
  }
  static async createQuizSubmission(quizId: string): Promise<QuizSubmission> {
    return await fetchMutation(api.submissions.start, { quizId }, await convexOptions()) as unknown as QuizSubmission;
  }
  static async submitQuizAnswers(quizId: string, id: string, answers: { question_id: string; user_answer: string | string[] }[]): Promise<QuizSubmission> {
    return await fetchMutation(api.submissions.submit, { quizId, id, answers }, await convexOptions()) as unknown as QuizSubmission;
  }
  static async gradeQuizSubmission(quizId: string, id: string, status: string | undefined, score: number | undefined): Promise<QuizSubmission> {
    if (status && status !== "submitted" && status !== "graded") throw new Error("Invalid submission status");
    return await fetchMutation(api.submissions.grade, { quizId, id, status: status as "submitted" | "graded" | undefined, score }, await convexOptions()) as unknown as QuizSubmission;
  }
  static async getLeaderboard(quizId?: string) { return fetchQuery(api.submissions.leaderboard, { quizId }); }
  static async getQuizInvitations(quizId: string): Promise<QuizInvitation[]> {
    return await fetchQuery(api.invitations.list, { quizId }, await convexOptions()) as QuizInvitation[];
  }
  static async getUserInvitations(): Promise<QuizInvitation[]> {
    return await fetchQuery(api.invitations.list, {}, await convexOptions()) as QuizInvitation[];
  }
  static async inviteUserToQuiz(data: InviteUserInput): Promise<QuizInvitation> {
    const invitation = await fetchMutation(api.invitations.create, { quizId: data.quiz_id, email: data.invitee_email }, await convexOptions());
    try {
      const redirectUrl = new URL("/get-started/sign-up", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
      redirectUrl.searchParams.set("redirect_url", `/explore/${data.quiz_id}`);
      await (await clerkClient()).invitations.createInvitation({ emailAddress: data.invitee_email, redirectUrl: redirectUrl.href });
    } catch (error) { console.warn("Clerk account invitation was not sent; quiz invitation was saved.", error instanceof Error ? error.message : "Unknown error"); }
    return invitation;
  }
  static async respondToInvitation(id: string, status: "accepted" | "declined"): Promise<QuizInvitation> {
    return fetchMutation(api.invitations.respond, { id, status }, await convexOptions());
  }
  static async deleteInvitation(id: string) { await fetchMutation(api.invitations.remove, { id }, await convexOptions()); }
}
