import { NextResponse } from "next/server";
import { adminDb } from "@/lib/supabase";
import { quoteSchema } from "@/lib/validation";
import { limited, ipOf } from "@/lib/ratelimit";

const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
async function notify(r: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY, to = process.env.QUOTE_NOTIFY_EMAIL, from = process.env.RESEND_FROM;
  if (!key || !to || !from) return;
  try {
    await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject: `New quote request: ${String(r.service)}`, html: `<p><b>${esc(r.full_name)}</b> (${esc(r.company)})<br>${esc(r.email)} · ${esc(r.phone)}<br>${esc(r.pickup)} → ${esc(r.destination)}</p><p>${esc(r.details)}</p>` }) });
  } catch (e) { console.error("quote email failed"); }
}

export async function POST(req: Request) {
  if (limited("quote:" + ipOf(req), 5, 600_000)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const body = await req.json().catch(() => null);
  const p = quoteSchema.safeParse(body);
  if (!p.success) return NextResponse.json({ error: "validation", fields: p.error.flatten().fieldErrors }, { status: 400 });
  const db = adminDb();
  if (!db) return NextResponse.json({ error: "not_configured" }, { status: 503 }); // never claim delivery
  const { website, ...row } = p.data;
  const { error } = await db.from("quote_requests").insert(row);
  if (error) return NextResponse.json({ error: "failed" }, { status: 500 });
  await notify(row); // best-effort: the request is already stored, so an email failure never loses it
  return NextResponse.json({ ok: true }, { status: 201 });
}
