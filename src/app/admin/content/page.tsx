import { requireAdmin } from "@/lib/auth";
import { saveContent } from "../actions";
import { schemas, type ContentKey } from "@/lib/content";
import { stats, testimonials } from "@/data/stats";
import { company } from "@/data/company";
import { pages } from "@/data/content";
export const dynamic = "force-dynamic";
const fb = { stats, testimonials, company, services: pages.services.items, fleet: pages.fleet.items, industries: pages.industries.items };
const help: Record<ContentKey, string> = { stats: "Public only when published is true AND value is a number.", testimonials: "Add ONLY real, consented client feedback. Empty list = section hidden.", services: "Each row: [slug, English title, Bangla title, English description, Bangla description]. Slug = lowercase letters, digits, hyphens.", fleet: "Each row: [category road|marine, EN title, BN title, EN description, BN description]. Do not invent quantities or specs.", industries: "Each row: [slug, EN title, BN title, EN description, BN description].", company: "Contact details shown on the Contact page. Do not invent details." };
export default async function C({ searchParams }: { searchParams: Promise<{ ok?: string; e?: string }> }) {
  const { ok, e } = await searchParams; const { db } = await requireAdmin();
  const { data } = await db.from("site_content").select("key,value");
  const cur = Object.fromEntries((data ?? []).map((r: any) => [r.key, r.value]));
  return (<div><h1 className="mb-2 text-3xl font-bold">Website content</h1>
    <p className="mb-6 text-sm text-steel">Edit as JSON. Invalid or unsafe content is rejected before saving. Changes appear on the public site within minutes.</p>
    {ok && <p role="status" className="mb-4 text-amber">Saved: {ok}</p>}{e && <p role="alert" className="mb-4 text-amber">Not saved ({e}). Check the JSON and field rules.</p>}
    {(Object.keys(schemas) as ContentKey[]).map(k => (<form key={k} action={saveContent} className="mb-8 border border-white/10 p-4">
      <input type="hidden" name="key" value={k} /><label htmlFor={k} className="font-semibold capitalize">{k}</label><p className="mb-2 text-sm text-steel">{help[k]}</p>
      <textarea id={k} name="value" rows={10} defaultValue={JSON.stringify(cur[k] ?? fb[k], null, 2)} className="w-full border border-white/20 bg-charcoal p-2 font-mono text-xs text-white" />
      <button className="mt-2 border border-amber px-4 py-1 text-amber">Save {k}</button></form>))}</div>);
}
