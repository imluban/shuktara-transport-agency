import { NextResponse } from "next/server";
import { adminDb } from "@/lib/supabase";
import { trackingId } from "@/lib/validation";
import { limited, ipOf } from "@/lib/ratelimit";

export async function GET(req: Request) {
  if (limited("trk:" + ipOf(req), 15)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const parsed = trackingId.safeParse(new URL(req.url).searchParams.get("id"));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const id = parsed.data, db = adminDb();
  if (!db) {
    if (id !== "SHK-DEMO000000") return NextResponse.json({ error: "unavailable" }, { status: 503 });
    return NextResponse.json({ demo: true, tracking_number: id, status: "in_transit", origin: "Chattogram", destination: "Dhaka",
      events: [{ status: "booking_received", location: "Chattogram", event_time: "2025-01-01T09:00:00Z" },{ status: "in_transit", location: "Feni", event_time: "2025-01-02T09:00:00Z" }] });
  }
  // Only whitelisted public columns; no customer data is ever selected.
  const { data, error } = await db.from("shipments")
    .select("tracking_number,status,shipment_type,origin,destination,dispatch_date,estimated_delivery_date,delivered_at,shipment_events(status,location,description,event_time)")
    .eq("tracking_number", id).maybeSingle();
  if (error) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  if (!data) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const { shipment_events, ...s } = data;
  return NextResponse.json({ demo: false, ...s, events: (shipment_events ?? []).sort((a, b) => +new Date(b.event_time) - +new Date(a.event_time)) });
}
