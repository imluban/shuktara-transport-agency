// In-memory limiter: fine for one instance. Use Upstash/Redis when scaling horizontally.
const hits = new Map<string, number[]>();
export function limited(key: string, max = 10, windowMs = 60_000) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter(t => now - t < windowMs);
  arr.push(now); hits.set(key, arr);
  return arr.length > max;
}
export const ipOf = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
