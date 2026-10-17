import { ConvexError } from "convex/values";
import type { Doc, TableNames } from "../_generated/dataModel";
import type { QueryCtx, MutationCtx } from "../_generated/server";

export type Context = QueryCtx | MutationCtx;
export function expose<T extends { _id: string; _creationTime: number; id?: string }>(row: T) {
  const { _id, _creationTime, ...fields } = row;
  void _creationTime;
  return { ...fields, id: row.id || _id };
}

export async function byId<T extends TableNames>(ctx: Context, table: T, id: string): Promise<Doc<T> | null> {
  const imported = await ctx.db.query(table as TableNames).withIndex("by_app_id", (q) => q.eq("id", id)).unique();
  if (imported) return imported as unknown as Doc<T>;
  const documentId = ctx.db.normalizeId(table, id);
  return documentId ? await ctx.db.get(documentId) as Doc<T> | null : null;
}

export async function viewer(ctx: Context) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  const mapping = await ctx.db.query("users").withIndex("by_clerk", (q) => q.eq("clerk_id", identity.subject)).unique();
  return {
    id: mapping?.id || identity.subject,
    email: identity.emailVerified === true ? identity.email?.toLowerCase() || null : null,
    name: identity.name || null,
  };
}
export async function requireUser(ctx: Context) {
  const user = await viewer(ctx);
  if (!user) throw new ConvexError("Unauthorized");
  return user;
}
export async function quizById(ctx: Context, id: string) {
  return await byId(ctx, "quizzes", id) || await ctx.db.query("quizzes").withIndex("by_slug", (q) => q.eq("slug", id)).unique();
}
export async function ownQuiz(ctx: Context, id: string) {
  const user = await requireUser(ctx);
  const quiz = await quizById(ctx, id);
  if (!quiz || quiz.creator_id !== user.id) throw new ConvexError("Quiz not found or unauthorized");
  return quiz;
}
export async function canAccess(ctx: Context, quiz: Doc<"quizzes">) {
  if (quiz.visibility === "public" && quiz.is_published) return true;
  const user = await viewer(ctx);
  if (!user) return false;
  if (quiz.creator_id === user.id) return true;
  if (!quiz.is_published) return false;
  const invitations = await ctx.db.query("quiz_invitations").withIndex("by_quiz", (q) => q.eq("quiz_id", quiz.id || quiz._id)).collect();
  return invitations.some((invitation) => invitation.status !== "declined" &&
    (invitation.invitee_id === user.id || invitation.invitee_email.toLowerCase() === user.email));
}
export async function accessibleQuiz(ctx: Context, id: string) {
  const quiz = await quizById(ctx, id);
  if (!quiz || !await canAccess(ctx, quiz)) throw new ConvexError("Quiz not found or unauthorized");
  return quiz;
}
export async function questionsWithOptions(ctx: Context, quiz: Doc<"quizzes">) {
  const owner = (await viewer(ctx))?.id === quiz.creator_id;
  const questions = await ctx.db.query("questions").withIndex("by_quiz", (q) => q.eq("quiz_id", quiz.id || quiz._id)).collect();
  return Promise.all(questions.map(async (question) => {
    const options = await ctx.db.query("question_options").withIndex("by_question", (q) => q.eq("question_id", question.id || question._id)).collect();
    return {
      ...expose(question),
      question_options: owner ? options.map(expose) :
        ["short_answer", "fill_in_blank"].includes(question.question_type) ? [] :
          options.map((option) => ({ id: option.id || option._id, question_id: option.question_id, option_text: option.option_text, order: option.order, created_at: option.created_at })),
    };
  }));
}
