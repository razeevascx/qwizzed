import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { byId, expose, ownQuiz, quizById, requireUser } from "./lib/access";

export const list = query({
  args: { quizId: v.optional(v.string()) },
  handler: async (ctx, { quizId }) => {
    const user = await requireUser(ctx);
    if (quizId) {
      const quiz = await ownQuiz(ctx, quizId);
      return (await ctx.db.query("quiz_invitations").withIndex("by_quiz", (q) => q.eq("quiz_id", quiz.id || quiz._id)).collect()).map(expose);
    }
    const invitations = [...await ctx.db.query("quiz_invitations").withIndex("by_invitee", (q) => q.eq("invitee_id", user.id)).collect(),
      ...(user.email ? await ctx.db.query("quiz_invitations").withIndex("by_email", (q) => q.eq("invitee_email", user.email!)).collect() : [])];
    const unique = [...new Map(invitations.map((invitation) => [invitation._id, invitation])).values()].filter((invitation) => invitation.status === "pending");
    return Promise.all(unique.sort((a, b) => b.invited_at.localeCompare(a.invited_at)).map(async (invitation) => {
      const quiz = await quizById(ctx, invitation.quiz_id);
      return { ...expose(invitation), quizzes: quiz ? { title: quiz.title, description: quiz.description, difficulty_level: quiz.difficulty_level } : null };
    }));
  },
});

export const create = mutation({
  args: { quizId: v.string(), email: v.string() },
  handler: async (ctx, { quizId, email }) => {
    const quiz = await ownQuiz(ctx, quizId);
    const user = await requireUser(ctx);
    email = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ConvexError("Invalid email address");
    if (quiz.visibility !== "private") throw new ConvexError("Only private quizzes can have invitations");
    const key = quiz.id || quiz._id;
    const existing = await ctx.db.query("quiz_invitations").withIndex("by_quiz", (q) => q.eq("quiz_id", key)).collect();
    if (existing.some((invitation) => invitation.invitee_email.toLowerCase() === email)) throw new ConvexError("User already invited to this quiz");
    const now = new Date().toISOString();
    const id = await ctx.db.insert("quiz_invitations", { quiz_id: key, inviter_id: user.id, invitee_email: email,
      invitee_id: null, status: "pending", invited_at: now, responded_at: null, created_at: now });
    return expose((await ctx.db.get(id))!);
  },
});

export const respond = mutation({
  args: { id: v.string(), status: v.union(v.literal("accepted"), v.literal("declined")) },
  handler: async (ctx, { id, status }) => {
    const user = await requireUser(ctx);
    const invitation = await byId(ctx, "quiz_invitations", id);
    if (!invitation || (invitation.invitee_id !== user.id && invitation.invitee_email.toLowerCase() !== user.email)) throw new ConvexError("Invitation not found or unauthorized");
    await ctx.db.patch(invitation._id, { status, invitee_id: user.id, responded_at: new Date().toISOString() });
    return expose((await ctx.db.get(invitation._id))!);
  },
});

export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const invitation = await byId(ctx, "quiz_invitations", id);
    if (!invitation) throw new ConvexError("Invitation not found");
    await ownQuiz(ctx, invitation.quiz_id);
    await ctx.db.delete(invitation._id);
  },
});
