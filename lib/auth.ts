import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexOptions } from "@/lib/convex";

export const getCurrentUser = cache(async () => {
  if (!(await auth()).isAuthenticated) return null;
  const user = await currentUser();
  if (!user) return null;
  const identity = await fetchQuery(api.users.current, {}, await convexOptions());
  if (!identity) throw new Error("Convex could not verify the Clerk session");
  return {
    id: identity.id,
    email: user.primaryEmailAddress?.verification?.status === "verified"
      ? user.primaryEmailAddress.emailAddress
      : undefined,
    user_metadata: { full_name: user.fullName, name: user.fullName, avatar_url: user.imageUrl },
  };
});
