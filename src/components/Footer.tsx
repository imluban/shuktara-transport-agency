import Link from "next/link";
import { NAV } from "@/data/content";
import Logo from "./Logo";
export default function Footer({ locale }: { locale: string }) {
  const bn = locale === "bn";
  return (<footer className="mt-24 border-t border-white/10 px-6 py-12 text-sm">
    <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:justify-between">
      <div><p className="flex items-center gap-3 font-semibold tracking-[0.2em]"><Logo /> SHUKTARA</p>
        <p className="mt-2 text-steel">{bn ? "শিল্পকে এগিয়ে নেওয়া। সম্ভাবনাকে সংযুক্ত করা।" : "Moving Industries. Connecting Possibilities."}</p>
        <p className="text-steel">{bn ? "প্রতিটি যাত্রায় নির্ভরযোগ্যতা।" : "Reliability in Every Journey."}</p></div>
      <nav className="flex flex-wrap gap-x-6 gap-y-2 text-steel">{NAV.map(n => <Link key={n[0]} href={`/${locale}/${n[0]}`}>{bn ? n[2] : n[1]}</Link>)}
        <Link href={`/${locale}/privacy`}>{bn ? "গোপনীয়তা" : "Privacy"}</Link><Link href={`/${locale}/terms`}>{bn ? "শর্তাবলি" : "Terms"}</Link></nav></div></footer>);
}
