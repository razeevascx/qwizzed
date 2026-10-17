import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { accessibleQuiz, byId, expose, ownQuiz, quizById, requireUser } from "./lib/access";
import { scoreAnswer } from "./lib/grading";

export const list = query({
  args: { quizId: v.optional(v.string()) },
  handler: async (ctx, { quizId }) => {
    if (quizId) {
      const quiz = await ownQuiz(ctx, quizId);
      return (await ctx.db.query("quiz_submissions").withIndex("by_quiz", (q) => q.eq("quiz_id", quiz.id || quiz._id)).collect()).map(expose)
        .sort((a, b) => (b.submitted_at || b.created_at).localeCompare(a.submitted_at || a.created_at));
    }
    const user = await requireUser(ctx);
    const quizzes = await ctx.db.query("quizzes").withIndex("by_creator", (q) => q.eq("creator_id", user.id)).collect();
    return (await Promise.all(quizzes.map((quiz) => ctx.db.query("quiz_submissions").withIndex("by_quiz", (q) => q.eq("quiz_id", quiz.id || quiz._id)).collect()))).flat().map(expose);
  },
});

export const get = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const user = await requireUser(ctx);
    const submission = await byId(ctx, "quiz_submissions", id);
    if (!submission) return null;
    const quiz = await quizById(ctx, submission.quiz_id);
    if (submission.user_id !== user.id && quiz?.creator_id !== user.id) throw new ConvexError("Unauthorized");
    return expose(submission);
  },
});

export const start = mutation({
  args: { quizId: v.string() },
  handler: async (ctx, { quizId }) => {
    const user = await requireUser(ctx);
    const quiz = await accessibleQuiz(ctx, quizId);
    if (quiz.creator_id !== user.id && (!quiz.is_published || (quiz.release_at && Date.parse(quiz.release_at) > Date.now()))) throw new ConvexError("This quiz is not available yet");
    const key = quiz.id || quiz._id;
    const now = new Date().toISOString();
    for (const invitation of await ctx.db.query("quiz_invitations").withIndex("by_quiz", (q) => q.eq("quiz_id", key)).collect()) {
      if (invitation.status === "pending" && (invitation.invitee_id === user.id || invitation.invitee_email.toLowerCase() === user.email)) {
        await ctx.db.patch(invitation._id, { status: "accepted", invitee_id: user.id, responded_at: now });
      }
    }
    const id = await ctx.db.insert("quiz_submissions", { quiz_id: key, user_id: user.id, status: "in_progress", score: 0, total_points: 0,
      submitted_by_email: user.email, submitted_by_name: user.name || user.email?.split("@")[0] || "User", created_at: now, submitted_at: null, time_taken: null });
    return expose((await ctx.db.get(id))!);
  },
});

export const submit = mutation({
  args: { quizId: v.string(), id: v.string(), answers: v.array(v.object({ question_id: v.string(), user_answer: v.union(v.string(), v.array(v.string())) })) },
  handler: async (ctx, { quizId, id, answers }) => {
    const user = await requireUser(ctx);
    const quiz = await accessibleQuiz(ctx, quizId);
    const submission = await byId(ctx, "quiz_submissions", id);
    if (!submission || submission.quiz_id !== (quiz.id || quiz._id) || submission.user_id !== user.id) throw new ConvexError("Submission not found or unauthorized");
    if (submission.status !== "in_progress") return expose(submission);
    if (new Set(answers.map((answer) => answer.question_id)).size !== answers.length) throw new ConvexError("Duplicate answers");
    for (const answer of answers) {
      const question = await byId(ctx, "questions", answer.question_id);
      if (!question || question.quiz_id !== submission.quiz_id) throw new ConvexError("Question does not belong to this quiz");
      const options = (await ctx.db.query("question_options").withIndex("by_question", (q) => q.eq("question_id", answer.question_id)).collect()).map(expose);
      const points = scoreAnswer(question, options, answer.user_answer);
      const existing = await ctx.db.query("quiz_answers").withIndex("by_submission_question", (q) => q.eq("submission_id", id).eq("question_id", answer.question_id)).collect();
      const fields = { user_answer: Array.isArray(answer.user_answer) ? JSON.stringify(answer.user_answer) : answer.user_answer,
        is_correct: points === question.points && points > 0, points_earned: points };
      if (existing[0]) {
        await ctx.db.patch(existing[0]._id, fields);
        for (const duplicate of existing.slice(1)) await ctx.db.delete(duplicate._id);
      } else await ctx.db.insert("quiz_answers", { ...fields, submission_id: id, question_id: answer.question_id, created_at: new Date().toISOString() });
    }
    const allAnswers = await ctx.db.query("quiz_answers").withIndex("by_submission", (q) => q.eq("submission_id", id)).collect();
    const questions = await ctx.db.query("questions").withIndex("by_quiz", (q) => q.eq("quiz_id", submission.quiz_id)).collect();
    await ctx.db.patch(submission._id, { score: allAnswers.reduce((sum, answer) => sum + answer.points_earned, 0),
      total_points: questions.reduce((sum, question) => sum + question.points, 0),
      submitted_at: new Date().toISOString(), status: "submitted", time_taken: Math.max(0, Math.floor((Date.now() - Date.parse(submission.created_at)) / 1000)) });
    return expose((await ctx.db.get(submission._id))!);
  },
});

export const grade = mutation({
  args: { quizId: v.string(), id: v.string(), status: v.optional(v.union(v.literal("submitted"), v.literal("graded"))), score: v.optional(v.number()) },
  handler: async (ctx, { quizId, id, status, score }) => {
    const quiz = await ownQuiz(ctx, quizId);
    const submission = await byId(ctx, "quiz_submissions", id);
    if (!submission || submission.quiz_id !== (quiz.id || quiz._id)) throw new ConvexError("Submission not found");
    const questions = await ctx.db.query("questions").withIndex("by_quiz", (q) => q.eq("quiz_id", submission.quiz_id)).collect();
    const total = questions.reduce((sum, question) => sum + question.points, 0);
    if (score !== undefined && (!Number.isFinite(score) || score < 0 || score > total)) throw new ConvexError("Invalid score");
    const answers = await ctx.db.query("quiz_answers").withIndex("by_submission", (q) => q.eq("submission_id", id)).collect();
    await ctx.db.patch(submission._id, { status: status || "graded", score: score ?? answers.reduce((sum, answer) => sum + answer.points_earned, 0), total_points: total, submitted_at: new Date().toISOString() });
    return expose((await ctx.db.get(submission._id))!);
  },
});

export const leaderboard = query({
  args: { quizId: v.optional(v.string()) },
  handler: async (ctx, { quizId }) => {
    const quizzes = quizId ? [await quizById(ctx, quizId)] : await ctx.db.query("quizzes").withIndex("by_publication", (q) => q.eq("visibility", "public").eq("is_published", true)).collect();
    const entries = [];
    for (const quiz of quizzes) {
      if (!quiz || quiz.visibility !== "public" || !quiz.is_published) continue;
      const submissions = await ctx.db.query("quiz_submissions").withIndex("by_quiz", (q) => q.eq("quiz_id", quiz.id || quiz._id)).collect();
      entries.push(...submissions.filter((submission) => submission.status !== "in_progress").map((submission) => ({ ...expose(submission),
        submission_id: submission.id || submission._id, submitted_by_email: submission.submitted_by_email ? submission.submitted_by_email.split("@")[0] + "***" : "Anonymous",
        score_percentage: submission.total_points > 0 ? Math.round(submission.score / submission.total_points * 100) : 0 })));
    }
    return entries.sort((a, b) => b.score - a.score || (a.submitted_at || a.created_at).localeCompare(b.submitted_at || b.created_at)).slice(0, quizId ? 100 : undefined).map((entry, index) => ({ ...entry, rank: index + 1 }));
  },
});
