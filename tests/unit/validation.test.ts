import { describe, it, expect } from "vitest";
import { trackingId, quoteSchema } from "@/lib/validation";
import { limited } from "@/lib/ratelimit";
const ok = { full_name: "Rahim Uddin", email: "r@example.com", phone: "+8801712345678", service: "marine", pickup: "Chattogram", destination: "Dhaka" };
describe("trackingId", () => {
  it("accepts and normalises valid IDs", () => expect(trackingId.parse(" shk-ab12cd34ef ")).toBe("SHK-AB12CD34EF"));
  it("rejects malformed IDs", () => { for (const v of ["", "123", "SHK-1", "SHK-AB12CD34E!", "x".repeat(50)]) expect(trackingId.safeParse(v).success).toBe(false); });
});
describe("quoteSchema", () => {
  it("accepts a valid quote", () => expect(quoteSchema.safeParse(ok).success).toBe(true));
  it("accepts local 01 phone format", () => expect(quoteSchema.safeParse({ ...ok, phone: "01712345678" }).success).toBe(true));
  it("rejects non-Bangladesh phone", () => expect(quoteSchema.safeParse({ ...ok, phone: "+14155550123" }).success).toBe(false));
  it("rejects unknown service", () => expect(quoteSchema.safeParse({ ...ok, service: "hacking" }).success).toBe(false));
  it("rejects filled honeypot", () => expect(quoteSchema.safeParse({ ...ok, website: "spam.com" }).success).toBe(false));
});
describe("rate limiter", () => {
  it("blocks after the max", () => { const k = "t" + Math.random(); for (let i = 0; i < 3; i++) expect(limited(k, 3)).toBe(false); expect(limited(k, 3)).toBe(true); });
});
