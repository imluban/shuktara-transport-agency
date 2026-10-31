import type { Metadata } from "next";
import Link from "next/link";
import { Noto_Sans_Bengali, Inter } from "next/font/google";
import { t } from "@/i18n/config";
import { NAV } from "@/data/content";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
const inter = Inter({ subsets: ["latin"], variable: "--f-en" });
const bnf = Noto_Sans_Bengali({ subsets: ["bengali"], variable: "--f-bn" });
export const generateStaticParams = () => [{ locale: "en" }, { locale: "bn" }];
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: t(locale).brand, alternates: { languages: { en: "/en", bn: "/bn" } } };
}
export default async function L({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params; const d = t(locale); const other = locale === "bn" ? "en" : "bn";
  return (
    <html lang={locale}><body className={`${inter.variable} ${bnf.variable}`} style={{ fontFamily: locale === "bn" ? "var(--f-bn)" : "var(--f-en)" }}>
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-navy/90 px-6 py-4 backdrop-blur">
        <Link href={`/${locale}`} className="flex items-center gap-3 text-sm font-semibold tracking-[0.2em]"><Logo /> {d.brand}</Link>
        <nav className="flex items-center gap-5 text-sm">
          {NAV.map(n => <Link key={n[0]} href={`/${locale}/${n[0]}`} className="hidden lg:inline">{locale === "bn" ? n[2] : n[1]}</Link>)}
          <details className="relative lg:hidden"><summary className="cursor-pointer list-none text-steel">{locale === "bn" ? "মেনু" : "Menu"}</summary>
            <div className="absolute right-0 mt-3 flex w-48 flex-col gap-4 border border-white/10 bg-charcoal p-5">{NAV.map(n => <Link key={n[0]} href={`/${locale}/${n[0]}`}>{locale === "bn" ? n[2] : n[1]}</Link>)}</div></details>
          <Link href={`/${locale}/quote`} className="bg-amber px-4 py-2 font-medium text-navy">{d.nav.quote}</Link>
          <Link href={`/${other}`} aria-label="Switch language" className="text-steel">{locale === "en" ? "EN | বাংলা" : "বাংলা | EN"}</Link>
        </nav>
      </header>
      {children}
      <Footer locale={locale} />
    </body></html>
  );
}
