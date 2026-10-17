import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { questionType } from "./schema";
import { accessibleQuiz, byId, canAccess, expose, ownQuiz, questionsWithOptions, quizById, requireUser } from "./lib/access";

const nullableString = v.union(v.string(), v.null());
const quizFields = {
  title: v.optional(v.string()), description: v.optional(nullableString),
  difficulty_level: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
  category: v.optional(nullableString), time_limit_minutes: v.optional(v.union(v.number(), v.null())),
  release_at: v.optional(nullableString), visibility: v.optional(v.union(v.literal("public"), v.literal("private"), v.literal("unlisted"))),
  organizer_name: v.optional(nullableString), is_published: v.optional(v.boolean()),
};
const option = v.object({ option_text: v.string(), is_correct: v.boolean() });

export const list = query({
  args: { scope: v.union(v.literal("public"), v.literal("mine"), v.literal("accessible")) },
  handler: async (ctx, { scope }) => {
    const published = scope === "mine" ? [] : await ctx.db.query("quizzes").withIndex("by_publication", (q) => q.eq("visibility", "public").eq("is_published", true)).collect();
    if (scope === "public") return published.map(expose).sort((a, b) => b.created_at.localeCompare(a.created_at));
    const user = await requireUser(ctx);
    const owned = await ctx.db.query("quizzes").withIndex("by_creator", (q) => q.eq("creator_id", user.id)).collect();
    if (scope === "mine") return owned.map(expose).sort((a, b) => b.created_at.localeCompare(a.created_at));
    const invites = [...await ctx.db.query("quiz_invitations").withIndex("by_invitee", (q) => q.eq("invitee_id", user.id)).collect(),
      ...(user.email ? await ctx.db.query("quiz_invitations").withIndex("by_email", (q) => q.eq("invitee_email", user.email!)).collect() : [])];
    const combined = new Map(published.map((quiz) => [quiz.id || quiz._id, { ...expose(quiz), accessType: "public", invitationStatus: null as string | null, invited_at: null as string | null }]));
    for (const invitation of invites) {
      if (invitation.status === "declined") continue;
      const quiz = await quizById(ctx, invitation.quiz_id);
      if (quiz && await canAccess(ctx, quiz)) combined.set(quiz.id || quiz._id, { ...expose(quiz), accessType: "invited", invitationStatus: invitation.status, invited_at: invitation.invited_at });
    }
    for (const quiz of owned) combined.set(quiz.id || quiz._id, { ...expose(quiz), accessType: "owner", invitationStatus: null, invited_at: null });
    return [...combined.values()].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  },
});

export const get = query({
  args: { id: v.string(), includeQuestions: v.optional(v.boolean()) },
  handler: async (ctx, { id, includeQuestions }) => {
    const quiz = await quizById(ctx, id);
    if (!quiz || !await canAccess(ctx, quiz)) return null;
    return { ...expose(quiz), scheduled_at: quiz.release_at, ...(includeQuestions ? { questions: await questionsWithOptions(ctx, quiz) } : {}) };
  },
});

// Management reads require ownership, independently of public quiz access.
export const owned = query({
  args: { id: v.string(), includeQuestions: v.optional(v.boolean()) },
  handler: async (ctx, { id, includeQuestions }) => {
    const user = await requireUser(ctx);
    const quiz = await quizById(ctx, id);
    if (!quiz || quiz.creator_id !== user.id) return null;
    return { ...expose(quiz), scheduled_at: quiz.release_at,
      ...(includeQuestions ? { questions: await questionsWithOptions(ctx, quiz) } : {}) };
  },
});

export const create = mutation({
  args: { ...quizFields, title: v.string() },
  handler: async (ctx, fields) => {
    const user = await requireUser(ctx);
    if (!fields.title.trim()) throw new ConvexError("A quiz title is required");
    const now = new Date().toISOString();
    const id = await ctx.db.insert("quizzes", {
      creator_id: user.id, title: fields.title, description: fields.description || "",
      difficulty_level: fields.difficulty_level || "medium", category: fields.category || "",
      time_limit_minutes: fields.time_limit_minutes ?? null, release_at: fields.release_at ?? null,
      organizer_name: fields.organizer_name ?? null, visibility: fields.visibility || "private",
      is_published: false, total_questions: 0, created_at: now, updated_at: now,
    });
    return expose((await ctx.db.get(id))!);
  },
});

export const update = mutation({
  args: { id: v.string(), fields: v.object(quizFields) },
  handler: async (ctx, { id, fields }) => {
    const quiz = await ownQuiz(ctx, id);
    if (fields.title !== undefined && !fields.title.trim()) throw new ConvexError("A quiz title is required");
    if (fields.is_published ?? quiz.is_published) {
      const question = await ctx.db.query("questions").withIndex("by_quiz", (q) => q.eq("quiz_id", quiz.id || quiz._id)).first();
      if (!question) throw new ConvexError("Add at least one question before publishing this quiz.");
    }
    await ctx.db.patch(quiz._id, { ...fields, updated_at: new Date().toISOString() });
    const updated = (await ctx.db.get(quiz._id))!;
    return { ...expose(updated), scheduled_at: updated.release_at };
  },
});

export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const quiz = await ownQuiz(ctx, id);
    const key = quiz.id || quiz._id;
    for (const question of await ctx.db.query("questions").withIndex("by_quiz", (q) => q.eq("quiz_id", key)).collect()) {
      for (const option of await ctx.db.query("question_options").withIndex("by_question", (q) => q.eq("question_id", question.id || question._id)).collect()) await ctx.db.delete(option._id);
      await ctx.db.delete(question._id);
    }
    for (const submission of await ctx.db.query("quiz_submissions").withIndex("by_quiz", (q) => q.eq("quiz_id", key)).collect()) {
      for (const answer of await ctx.db.query("quiz_answers").withIndex("by_submission", (q) => q.eq("submission_id", submission.id || submission._id)).collect()) await ctx.db.delete(answer._id);
      await ctx.db.delete(submission._id);
    }
    for (const invitation of await ctx.db.query("quiz_invitations").withIndex("by_quiz", (q) => q.eq("quiz_id", key)).collect()) await ctx.db.delete(invitation._id);
    await ctx.db.delete(quiz._id);
  },
});

export const questions = query({
  args: { quizId: v.string() },
  handler: async (ctx, { quizId }) => questionsWithOptions(ctx, await accessibleQuiz(ctx, quizId)),
});

export const saveQuestion = mutation({
  args: { quizId: v.string(), id: v.optional(v.string()), question_text: v.string(), question_type: questionType,
    points: v.optional(v.number()), options: v.optional(v.array(option)) },
  handler: async (ctx, { quizId, id, ...fields }) => {
    const quiz = await ownQuiz(ctx, quizId);
    const key = quiz.id || quiz._id;
    if (!fields.question_text.trim() || (fields.points !== undefined && (!Number.isInteger(fields.points) || fields.points < 0))) throw new ConvexError("Invalid question or points");
    const existing = id ? await byId(ctx, "questions", id) : null;
    if (id && (!existing || existing.quiz_id !== key)) throw new ConvexError("Question not found");
    const { options, ...questionFields } = fields;
    const now = new Date().toISOString();
    const currentQuestions = await ctx.db.query("questions").withIndex("by_quiz", (q) => q.eq("quiz_id", key)).collect();
    const questionId = existing?._id || await ctx.db.insert("questions", { ...questionFields, points: fields.points ?? 1,
      quiz_id: key, order: Math.max(0, ...currentQuestions.map((question) => question.order)) + 1, created_at: now, updated_at: now });
    if (existing) await ctx.db.patch(questionId, { ...questionFields, updated_at: now });
    const questionKey = existing?.id || questionId;
    if (options) {
      for (const old of await ctx.db.query("question_options").withIndex("by_question", (q) => q.eq("question_id", questionKey)).collect()) await ctx.db.delete(old._id);
      for (const [index, value] of options.entries()) await ctx.db.insert("question_options", { ...value, question_id: questionKey, order: index + 1, created_at: now });
    }
    await ctx.db.patch(quiz._id, { total_questions: currentQuestions.length + (existing ? 0 : 1), updated_at: now });
    return (await questionsWithOptions(ctx, quiz)).find((question) => question.id === questionKey)!;
  },
});

export const removeQuestion = mutation({
  args: { quizId: v.string(), id: v.string() },
  handler: async (ctx, { quizId, id }) => {
    const quiz = await ownQuiz(ctx, quizId);
    const question = await byId(ctx, "questions", id);
    if (!question || question.quiz_id !== (quiz.id || quiz._id)) throw new ConvexError("Question not found");
    for (const option of await ctx.db.query("question_options").withIndex("by_question", (q) => q.eq("question_id", id)).collect()) await ctx.db.delete(option._id);
    // Preserve submissions, removing answers whose question is deleted.
    for (const submission of await ctx.db.query("quiz_submissions").withIndex("by_quiz", (q) => q.eq("quiz_id", quiz.id || quiz._id)).collect()) {
      for (const answer of await ctx.db.query("quiz_answers").withIndex("by_submission_question", (q) => q.eq("submission_id", submission.id || submission._id).eq("question_id", id)).collect()) await ctx.db.delete(answer._id);
    }
    await ctx.db.delete(question._id);
    const remaining = await ctx.db.query("questions").withIndex("by_quiz", (q) => q.eq("quiz_id", quiz.id || quiz._id)).collect();
    await ctx.db.patch(quiz._id, { total_questions: remaining.length, ...(remaining.length === 0 ? { is_published: false } : {}), updated_at: new Date().toISOString() });
  },
});

export const reorder = mutation({
  args: { quizId: v.string(), questions: v.array(v.object({ id: v.string(), order: v.number() })) },
  handler: async (ctx, { quizId, questions }) => {
    const quiz = await ownQuiz(ctx, quizId);
    if (new Set(questions.map((question) => question.id)).size !== questions.length) throw new ConvexError("Duplicate questions");
    for (const value of questions) {
      const question = await byId(ctx, "questions", value.id);
      if (!question || question.quiz_id !== (quiz.id || quiz._id) || !Number.isInteger(value.order) || value.order < 1) throw new ConvexError("Invalid question order");
      await ctx.db.patch(question._id, { order: value.order });
    }
  },
});
