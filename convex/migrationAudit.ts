import { internalQuery } from "./_generated/server";
import { expose } from "./lib/access";

// Admin-only: used to compare the migrated data with the source backup.
export const snapshot = internalQuery({
  args: {},
  handler: async (ctx) => {
    const tables = ["users", "quizzes", "questions", "question_options", "quiz_submissions", "quiz_answers", "quiz_invitations"] as const;
    return Object.fromEntries(await Promise.all(tables.map(async (table) => [table, (await ctx.db.query(table).collect()).map(expose)])));
  },
});
