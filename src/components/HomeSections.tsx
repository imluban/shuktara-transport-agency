import Link from "next/link";
import { pages } from "@/data/content";
import { stats as sFb, testimonials as tFb } from "@/data/stats";
import { getContent } from "@/lib/content";
import Counter from "./Counter";
import Reveal from "./Reveal";
import Photo from "./Photo";
import { sceneFor } from "@/lib/photo";
export default async function HomeSections({ locale }: { locale: string }) {
  const [stats, testimonials, services] = await Promise.all([getContent("stats", sFb), getContent("testimonials", tFb), getContent("services", pages.services.items)]);
  const bn = locale === "bn";
  const st = stats.filter(s => s.published && s.value !== null), ts = testimonials.filter(x => x.published);
  return (<>
    <section className="mx-auto max-w-6xl px-6 py-24"><Reveal>
      <h2 className="mb-10 text-3xl font-bold md:text-5xl">{bn ? "আমাদের সেবা" : "Our Services"}</h2>
      <div className="grid gap-px bg-white/10 md:grid-cols-3">{services.map(i => (
        <Link key={i[0]} href={`/${locale}/services/${i[0]}`} className="bg-charcoal p-8 transition hover:bg-navy"><Photo name={sceneFor(i[0])} className="mb-5 aspect-[16/9]" /><h3 className="text-lg font-semibold">{bn ? i[2] : i[1]}</h3><p className="mt-3 text-sm text-steel">{bn ? i[4] : i[3]}</p></Link>))}</div></Reveal>
    </section>
    {st.length > 0 && <section className="border-y border-white/10 py-16"><div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-4">{st.map(s => (
      <div key={s.en}><p className="text-5xl font-bold text-amber"><Counter to={s.value!} suffix={s.suffix} /></p><p className="mt-2 text-steel">{bn ? s.bn : s.en}</p></div>))}</div></section>}
    {ts.length > 0 && <section className="mx-auto max-w-4xl px-6 py-24">{ts.map(x => (
      <figure key={x.name}><blockquote className="text-2xl">{bn ? x.quote.bn : x.quote.en}</blockquote><figcaption className="mt-4 text-steel">{x.name}, {x.role}, {x.company}</figcaption></figure>))}</section>}
  </>);
}
