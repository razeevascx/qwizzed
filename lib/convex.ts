import "server-only";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

export const convexOptions = cache(async () => ({ token: (await (await auth()).getToken()) || undefined }));
