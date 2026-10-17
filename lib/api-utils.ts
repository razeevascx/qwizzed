import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) return { user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  return { user, error: null };
}
