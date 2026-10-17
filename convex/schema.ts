import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const nullableString = v.union(v.string(), v.null());
const nullableNumber = v.union(v.number(), v.null());
const id = v.optional(v.string());
const questionType = v.union(v.literal("multiple_choice"), v.literal("short_answer"), v.literal("true_false"), v.literal("fill_in_blank"));
export { questionType };

export default defineSchema({
  users: defineTable({ id, clerk_id: v.string() }).index("by_app_id", ["id"]).index("by_clerk", ["clerk_id"]),
  quizzes: defineTable({
    id, title: v.string(), description: nullableString, creator_id: v.string(),
    slug: v.optional(nullableString), created_at: v.string(), updated_at: v.string(),
    is_published: v.boolean(), visibility: v.union(v.literal("public"), v.literal("private"), v.literal("unlisted")),
    total_questions: v.number(), time_limit_minutes: nullableNumber, release_at: v.optional(nullableString),
    difficulty_level: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    category: nullableString, organizer_name: nullableString,
  }).index("by_app_id", ["id"]).index("by_slug", ["slug"]).index("by_creator", ["creator_id"]).index("by_publication", ["visibility", "is_published"]),
  questions: defineTable({ id, quiz_id: v.string(), question_text: v.string(), question_type: questionType,
    order: v.number(), points: v.number(), created_at: v.string(), updated_at: v.string(),
  }).index("by_app_id", ["id"]).index("by_quiz", ["quiz_id", "order"]),
  question_options: defineTable({ id, question_id: v.string(), option_text: v.string(), is_correct: v.boolean(), order: v.number(), created_at: v.string(),
  }).index("by_app_id", ["id"]).index("by_question", ["question_id", "order"]),
  quiz_submissions: defineTable({ id, quiz_id: v.string(), user_id: nullableString, created_at: v.string(),
    submitted_at: nullableString, score: v.number(), total_points: v.number(), time_taken: nullableNumber,
    status: v.union(v.literal("in_progress"), v.literal("submitted"), v.literal("graded")),
    submitted_by_email: nullableString, submitted_by_name: nullableString,
  }).index("by_app_id", ["id"]).index("by_quiz", ["quiz_id"]).index("by_user", ["user_id"]),
  quiz_answers: defineTable({ id, submission_id: v.string(), question_id: v.string(), user_answer: nullableString,
    is_correct: v.boolean(), points_earned: v.number(), created_at: v.string(),
  }).index("by_app_id", ["id"]).index("by_submission", ["submission_id"]).index("by_submission_question", ["submission_id", "question_id"]),
  quiz_invitations: defineTable({ id, quiz_id: v.string(), inviter_id: v.string(), invitee_email: v.string(), invitee_id: nullableString,
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("declined")),
    invited_at: v.string(), responded_at: nullableString, created_at: v.string(),
  }).index("by_app_id", ["id"]).index("by_quiz", ["quiz_id"]).index("by_email", ["invitee_email"]).index("by_invitee", ["invitee_id"]),
});
