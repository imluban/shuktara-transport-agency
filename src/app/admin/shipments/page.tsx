import { requireAdmin } from "@/lib/auth";
import { createShipment, addEvent } from "../actions";
import { STATUSES } from "@/lib/statuses";
export const dynamic = "force-dynamic";
const inp = "border border-white/20 bg-charcoal px-2 py-1 text-white";
export default async function S({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q = "", page = "1" } = await searchParams; const { db } = await requireAdmin();
  const pg = Math.max(1, parseInt(page) || 1), size = 20, safe = q.replace(/[^\w\- ]/g, "");
  let qb = db.from("shipments").select("id,tracking_number,shipment_type,origin,destination,status,shipment_events(status,location,event_time)").order("created_at", { ascending: false }).range((pg - 1) * size, pg * size - 1);
  if (safe) qb = qb.or(`tracking_number.ilike.%${safe}%,origin.ilike.%${safe}%,destination.ilike.%${safe}%`);
  const { data } = await qb;
  return (<div><h1 className="mb-6 text-3xl font-bold">Shipments</h1>
    <form action={createShipment} className="mb-8 grid gap-3 border border-white/10 p-4 md:grid-cols-3"><p className="md:col-span-3 font-semibold">New shipment (tracking ID is generated automatically)</p>
      <input name="shipment_type" placeholder="Type (e.g. petroleum)" required className={inp} /><input name="origin" placeholder="Origin" required className={inp} /><input name="destination" placeholder="Destination" required className={inp} />
      <input name="customer_name" placeholder="Customer (private)" className={inp} /><input name="dispatch_date" type="date" className={inp} /><input name="estimated_delivery_date" type="date" className={inp} />
      <button className="bg-amber px-4 py-1 font-medium text-navy md:col-span-3">Create</button></form>
    <form className="mb-6"><input name="q" defaultValue={q} placeholder="Search tracking ID / origin / destination" className={inp + " w-80"} /></form>
    {(data ?? []).map((s: any) => (<div key={s.id} className="mb-4 border border-white/10 p-4">
      <p className="font-mono text-amber">{s.tracking_number} <span className="text-white">· {s.status}</span></p><p className="text-sm text-steel">{s.shipment_type} · {s.origin} → {s.destination}</p>
      <ul className="my-2 text-sm">{[...s.shipment_events].sort((a: any, b: any) => +new Date(b.event_time) - +new Date(a.event_time)).map((e: any, i: number) => <li key={i}>{new Date(e.event_time).toLocaleString()} — {e.status} {e.location && `(${e.location})`}</li>)}</ul>
      <form action={addEvent} className="flex flex-wrap gap-2"><input type="hidden" name="shipment_id" value={s.id} />
        <select name="status" className={inp}>{STATUSES.map(x => <option key={x}>{x}</option>)}</select><input name="location" placeholder="Location" className={inp} /><input name="description" placeholder="Note" className={inp} /><button className="border border-amber px-3 text-amber">Add event</button></form></div>))}
    <div className="flex gap-4 text-sm">{pg > 1 && <a href={`?q=${safe}&page=${pg - 1}`}>← Prev</a>}{(data?.length ?? 0) === size && <a href={`?q=${safe}&page=${pg + 1}`}>Next →</a>}</div></div>);
}
