const configuredSiteUrl = process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://qwizzed.com");

export const siteUrl = configuredSiteUrl.replace(/\/+$/, "");
