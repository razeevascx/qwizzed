import { query } from "./_generated/server";
import { viewer } from "./lib/access";

export const current = query({ args: {}, handler: (ctx) => viewer(ctx) });
