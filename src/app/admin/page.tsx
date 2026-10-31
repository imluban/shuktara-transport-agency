import { requireAdmin } from "@/lib/auth";
export const dynamic = "force-dynamic";
export default async function D() {
  const { db } = await requireAdmin();
  const n = async (f: (q: any) => any, t: string) => (await f(db.from(t).select("id", { count: "exact", head: true }))).count ?? 0;
  const [total, delivered, cancelled, pending] = await Promise.all([n(q => q, "shipments"), n(q => q.eq("status", "delivered"), "shipments"), n(q => q.eq("status", "cancelled"), "shipments"), n(q => q.eq("status", "new"), "quote_requests")]);
  const { data: ev } = await db.from("shipment_events").select("status,location,event_time,shipments(tracking_number)").order("event_time", { ascending: false }).limit(5);
  const { data: qs } = await db.from("quote_requests").select("full_name,service,created_at").order("created_at", { ascending: false }).limit(5);
  const cards: [string, number][] = [["Total shipments", total], ["Active shipments", total - delivered - cancelled], ["Delivered", delivered], ["Pending inquiries", pending]];
  return (<div><h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
    <div className="grid gap-px bg-white/10 md:grid-cols-4">{cards.map(c => <div key={c[0]} className="bg-charcoal p-6"><p className="text-sm text-steel">{c[0]}</p><p className="text-4xl font-bold">{c[1]}</p></div>)}</div>
    <div className="mt-10 grid gap-10 md:grid-cols-2">
      <section><h2 className="mb-3 font-semibold">Recent shipment activity</h2>{(ev ?? []).map((e: any, i) => <p key={i} className="border-b border-white/10 py-2 text-sm">{e.shipments?.tracking_number} · {e.status} · {e.location}</p>)}</section>
      <section><h2 className="mb-3 font-semibold">Recent quote requests</h2>{(qs ?? []).map((q, i) => <p key={i} className="border-b border-white/10 py-2 text-sm">{q.full_name} · {q.service}</p>)}</section></div></div>);
}
