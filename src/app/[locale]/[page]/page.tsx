import Link from "next/link";
import { notFound } from "next/navigation";
import { pages } from "@/data/content";
import FleetGrid from "@/components/FleetGrid";
import { getContent } from "@/lib/content";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import { photoSrc, sceneFor } from "@/lib/photo";
export const generateStaticParams = () => ["en", "bn"].flatMap(locale => Object.keys(pages).map(page => ({ locale, page })));
export default async function P({ params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale, page } = await params; const p = pages[page]; if (!p) notFound();
  const items = page === "services" || page === "fleet" || page === "industries" ? await getContent(page, p.items as any) as typeof p.items : p.items;
  const bn = locale === "bn", c = bn ? p.bn : p.en;
  return (<main className="mx-auto max-w-6xl px-6 py-24">
    <h1 className="max-w-4xl text-4xl font-bold md:text-6xl">{c.h}</h1>
    <p className="mt-6 max-w-2xl text-lg text-steel">{c.intro}</p>
    {c.note && <p className="mt-4 border-l-2 border-amber pl-4 text-sm text-amber">{c.note}</p>}
    <Reveal className="mt-14">{page === "fleet" ? <FleetGrid photos={{ road: photoSrc("road"), marine: photoSrc("marine") }} items={items} bn={bn} /> : (
      <div className="grid gap-px bg-white/10 md:grid-cols-2">{items.map(i => {
        const inner = (<><Photo name={sceneFor(i[0])} className="mb-5 aspect-[16/9]" /><h2 className="text-xl font-semibold">{bn ? i[2] : i[1]}</h2><p className="mt-3 text-steel">{bn ? i[4] : i[3]}</p></>);
        return p.link ? <Link key={i[0]} href={`/${locale}/${page}/${i[0]}`} className="bg-charcoal p-8 hover:bg-navy">{inner}</Link> : <article key={i[0]} className="bg-charcoal p-8">{inner}</article>;})}</div>)}</Reveal>
  </main>);
}
