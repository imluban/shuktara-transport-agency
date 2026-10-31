import Link from "next/link";
import Photo from "@/components/Photo";
import { t } from "@/i18n/config";
import HomeSections from "@/components/HomeSections";
import { HeroBackdrop, HeroText } from "@/components/HeroMotion";
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const h = t(locale).hero, bn = locale === "bn";
  return (<>
    <main className="relative flex min-h-[90vh] items-end overflow-hidden bg-gradient-to-b from-charcoal to-navy px-6 pb-24">
      <HeroBackdrop><Photo name="hero" priority className="h-full w-full" alt={bn ? "সন্ধ্যায় হাইওয়েতে জ্বালানিবাহী ট্যাংকার ট্রাক (প্রতিনিধিত্বমূলক চিত্র)" : "Fuel tanker truck on a highway at dusk (representative artwork)"} /></HeroBackdrop>
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/20" />
      <HeroText>
        <p className="mb-6 flex items-center gap-3 text-xs tracking-[0.3em] text-amber"><span className="h-px w-10 bg-amber" />{h.eyebrow}</p>
        <h1 className="text-5xl font-bold leading-[1.05] md:text-8xl">{h.h1a}<br /><span className="text-steel">{h.h1b}</span></h1>
        <p className="mt-8 max-w-xl text-lg text-steel">{h.sub}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href={`/${locale}/services`} className="bg-amber px-6 py-3 font-medium text-navy">{h.cta1}</Link>
          <Link href={`/${locale}/quote`} className="border border-white/30 px-6 py-3">{h.cta2}</Link></div>
      </HeroText>
      <div aria-hidden="true" className="absolute bottom-6 right-6 hidden flex-col items-center gap-2 text-[10px] tracking-[0.3em] text-steel md:flex"><span>SCROLL</span><span className="h-12 w-px animate-pulse bg-amber" /></div>
    </main>
    <HomeSections locale={locale} />
  </>);
}
