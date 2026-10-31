"use client";
import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { places, routes, type Place } from "@/data/network";
const T = {
  en: { road: "Road", marine: "Marine", note: "Illustrative location — not a confirmed Shuktara facility or office.", port: "Port city", hint: "Select a marker. All routes shown are illustrative, not verified company routes." },
  bn: { road: "সড়ক", marine: "নৌ", note: "দৃষ্টান্তমূলক অবস্থান — শুকতারার নিশ্চিত কার্যালয় বা স্থাপনা নয়।", port: "বন্দর শহর", hint: "একটি মার্কার নির্বাচন করুন। দেখানো সব রুট দৃষ্টান্তমূলক, যাচাইকৃত কোম্পানি রুট নয়।" },
};
export default function NetworkMap({ locale }: { locale: string }) {
  const bn = locale === "bn", d = bn ? T.bn : T.en;
  const [layers, setLayers] = useState({ road: true, marine: true }); const [sel, setSel] = useState<Place | null>(null);
  const by = Object.fromEntries(places.map(p => [p.id, p]));
  const tile = process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  return (<div>
    <div className="mb-4 flex flex-wrap gap-3" role="group">{(["road", "marine"] as const).map(k => (
      <button key={k} aria-pressed={layers[k]} onClick={() => setLayers(l => ({ ...l, [k]: !l[k] }))} className={`border px-4 py-2 ${layers[k] ? "border-amber text-amber" : "border-white/20 text-steel"}`}>{d[k]}</button>))}</div>
    <div className="h-[28rem] border border-white/10 md:h-[34rem]">
      <MapContainer center={[23.7, 90.4]} zoom={7} minZoom={6} maxBounds={[[20.2, 87.5], [26.9, 93.1]]} className="h-full w-full bg-navy" scrollWheelZoom={false}>
        <TileLayer url={tile} attribution="&copy; OpenStreetMap contributors &copy; CARTO" />
        {routes.filter(r => layers[r.kind]).map((r, i) => (
          <Polyline key={i} positions={[by[r.from].pos, by[r.to].pos]} pathOptions={{ color: "#D99A36", weight: 3, dashArray: r.kind === "marine" ? "8 8" : undefined, opacity: 0.85 }} />))}
        {places.map(p => (
          <CircleMarker key={p.id} center={p.pos} radius={sel?.id === p.id ? 10 : 7} pathOptions={{ color: "#fff", fillColor: "#D99A36", fillOpacity: 1, weight: 2 }} eventHandlers={{ click: () => setSel(p) }}>
            <Tooltip>{bn ? p.bn : p.en}</Tooltip></CircleMarker>))}
      </MapContainer></div>
    <div className="mt-4 min-h-[4rem] border-l-2 border-amber pl-4" aria-live="polite">
      {sel ? <><p className="text-xl font-semibold">{bn ? sel.bn : sel.en}{sel.port && ` · ${d.port}`}</p><p className="text-sm text-amber">{d.note}</p></> : <p className="text-steel">{d.hint}</p>}</div>
  </div>);
}
