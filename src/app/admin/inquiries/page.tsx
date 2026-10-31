import { requireAdmin } from "@/lib/auth";
import { updateQuote } from "../actions";
export const dynamic = "force-dynamic";
const SV = ["petroleum","road_freight","marine","industrial","cargo","warehousing","other"];
export default async function I({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams; const { db } = await requireAdmin();
  let q = db.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(50);
  if (service && SV.includes(service)) q = q.eq("service", service);
  const { data } = await q;
  return (<div><h1 className="mb-4 text-3xl font-bold">Quote requests</h1>
    <p className="mb-6 text-sm">Filter: <a href="?">all</a> {SV.map(s => <a key={s} href={`?service=${s}`} className="ml-3 text-steel">{s}</a>)}</p>
    {(data ?? []).map((r: any) => (<div key={r.id} className="mb-4 border border-white/10 p-4 text-sm">
      <p className="font-semibold">{r.full_name} {r.company && `· ${r.company}`} · {r.service}</p><p className="text-steel">{r.email} · {r.phone} · {r.pickup} → {r.destination}</p>
      {r.details && <p className="my-2">{r.details}</p>}
      <form action={updateQuote} className="mt-2 flex flex-wrap gap-2"><input type="hidden" name="id" value={r.id} />
        <select name="status" defaultValue={r.status} className="border border-white/20 bg-charcoal px-2 py-1">{["new","in_review","quoted","closed"].map(s => <option key={s}>{s}</option>)}</select>
        <input name="internal_notes" defaultValue={r.internal_notes ?? ""} placeholder="Internal notes" className="flex-1 border border-white/20 bg-charcoal px-2 py-1" /><button className="border border-amber px-3 text-amber">Save</button></form></div>))}</div>);
}
