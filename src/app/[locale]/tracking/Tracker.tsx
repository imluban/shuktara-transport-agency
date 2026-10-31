"use client";
import { useState } from "react";
type Ev = { status: string; location?: string; description?: string; event_time: string };
type R = { demo: boolean; tracking_number: string; status: string; origin: string; destination: string; events: Ev[] };
export default function Tracker({ d }: { d: any }) {
  const [id, setId] = useState(""); const [r, setR] = useState<R | null>(null); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  async function go(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(""); setR(null);
    try {
      const res = await fetch(`/api/tracking?id=${encodeURIComponent(id)}`);
      if (res.ok) setR(await res.json());
      else setMsg(res.status === 400 ? d.invalid : res.status === 404 ? d.notfound : d.error);
    } catch { setMsg(d.error); } finally { setBusy(false); }
  }
  return (
    <div>
      <form onSubmit={go} className="flex gap-3">
        <label className="sr-only" htmlFor="tid">{d.label}</label>
        <input id="tid" value={id} onChange={e => setId(e.target.value)} placeholder="SHK-XXXXXXXXXX" className="flex-1 border border-white/20 bg-charcoal px-4 py-3" required />
        <button disabled={busy} className="bg-amber px-6 font-medium text-navy disabled:opacity-50">{d.btn}</button>
      </form>
      <p role="alert" className="mt-4 text-amber">{msg}</p>
      {r && (
        <section className="mt-8 border border-white/10 p-6">
          {r.demo && <p className="mb-4 text-xs tracking-widest text-amber">{d.demo}</p>}
          <p className="font-mono">{r.tracking_number}</p>
          <p className="text-2xl font-semibold">{d.status[r.status] ?? r.status}</p>
          <p className="text-steel">{r.origin} → {r.destination}</p>
          <ol className="mt-6 space-y-4 border-l border-amber/50 pl-6">
            {r.events.map((e, i) => (
              <li key={i}><p className="font-medium">{d.status[e.status] ?? e.status}</p>
                <p className="text-sm text-steel">{e.location} · {new Date(e.event_time).toLocaleString()}</p>
                {e.description && <p className="text-sm">{e.description}</p>}</li>))}
          </ol>
        </section>)}
    </div>);
}
