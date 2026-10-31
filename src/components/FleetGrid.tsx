"use client";
import { useState } from "react";
import type { Item } from "@/data/content";
export default function FleetGrid({ items, bn, photos }: { items: Item[]; bn: boolean; photos: Record<string, string> }) {
  const [f, setF] = useState("all");
  const tabs = [["all","All","সব"],["road","Road","সড়ক"],["marine","Marine","নৌ"]];
  return (<div>
    <div className="mb-8 flex gap-3" role="group">{tabs.map(([k, e, b]) => (
      <button key={k} aria-pressed={f === k} onClick={() => setF(k)} className={`border px-4 py-2 ${f === k ? "border-amber text-amber" : "border-white/20"}`}>{bn ? b : e}</button>))}</div>
    <div className="grid gap-px bg-white/10 md:grid-cols-3">{items.filter(i => f === "all" || i[0] === f).map((i, n) => (
      <article key={n} className="bg-charcoal"><img src={photos[i[0]]} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" /><div className="p-8"><h2 className="text-xl font-semibold">{bn ? i[2] : i[1]}</h2><p className="mt-3 text-steel">{bn ? i[4] : i[3]}</p></div></article>))}</div>
  </div>);
}
