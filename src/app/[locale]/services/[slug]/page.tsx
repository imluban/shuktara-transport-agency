import Link from "next/link";
import { notFound } from "next/navigation";
import { pages } from "@/data/content";
import { getContent } from "@/lib/content";
import Photo from "@/components/Photo";
import { sceneFor } from "@/lib/photo";
export const generateStaticParams = () => ["en", "bn"].flatMap(locale => pages.services.items.map(i => ({ locale, slug: i[0] })));
export default async function S({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params; const i = (await getContent("services", pages.services.items)).find(x => x[0] === slug); if (!i) notFound();
  const bn = locale === "bn";
  return (<main className="mx-auto max-w-3xl px-6 py-24">
    <Photo name={sceneFor(slug)} className="mb-10 aspect-[21/9]" /><h1 className="text-4xl font-bold md:text-6xl">{bn ? i[2] : i[1]}</h1>
    <p className="mt-6 text-lg text-steel">{bn ? i[4] : i[3]}</p>
    <p className="mt-4 text-sm text-amber">{(bn ? pages.services.bn : pages.services.en).note}</p>
    <Link href={`/${locale}/quote`} className="mt-10 inline-block bg-amber px-6 py-3 font-medium text-navy">{bn ? "কোটেশন চান" : "Request a Quote"}</Link>
  </main>);
}
