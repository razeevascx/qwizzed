export function authRedirect(value: string | null) {
  const origin = "https://qwizzed.invalid";
  if (!value?.startsWith("/")) return "/explore";
  try {
    const url = new URL(value, origin);
    return url.origin === origin ? url.pathname + url.search + url.hash : "/explore";
  } catch {
    return "/explore";
  }
}
