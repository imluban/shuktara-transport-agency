import { describe, it, expect, beforeAll } from "vitest";
import { GET } from "@/app/api/tracking/route";
import { POST } from "@/app/api/quotes/route";
beforeAll(() => { delete process.env.NEXT_PUBLIC_SUPABASE_URL; delete process.env.SUPABASE_SERVICE_ROLE_KEY; });
const get = (id: string, ip = "1.1.1.1") => GET(new Request(`http://x/api/tracking?id=${id}`, { headers: { "x-forwarded-for": ip } }));
const post = (b: unknown, ip: string) => POST(new Request("http://x/api/quotes", { method: "POST", body: JSON.stringify(b), headers: { "x-forwarded-for": ip } }));
const q = { full_name: "Rahim", email: "r@example.com", phone: "+8801712345678", service: "marine", pickup: "Dhaka", destination: "Khulna" };
describe("GET /api/tracking (unconfigured)", () => {
  it("returns labelled demo data only for the demo ID", async () => { const j = await (await get("SHK-DEMO000000")).json(); expect(j.demo).toBe(true); });
  it("never fabricates other shipments", async () => expect((await get("SHK-ABCDEFGH12")).status).toBe(503));
  it("rejects invalid IDs", async () => expect((await get("bad")).status).toBe(400));
  it("rate limits", async () => { let s = 0; for (let i = 0; i < 20; i++) s = (await get("bad", "9.9.9.9")).status; expect(s).toBe(429); });
});
describe("POST /api/quotes (unconfigured)", () => {
  it("never reports success without a backend", async () => expect((await post(q, "2.2.2.2")).status).toBe(503));
  it("validates server-side", async () => expect((await post({ ...q, email: "nope" }, "3.3.3.3")).status).toBe(400));
});
