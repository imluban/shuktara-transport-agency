import Link from "next/link";
import { company } from "@/data/company";
import { getContent } from "@/lib/content";
export default async function C({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const bn = locale === "bn"; const c = await getContent("company", company);
  const rows: [string, string, string][] = [["Address","ঠিকানা",c.address],["Phone","ফোন",c.phone],["Email","ইমেইল",c.email],["Business hours","কার্যসময়",c.hours]];
  return (<main className="mx-auto max-w-3xl px-6 py-24"><h1 className="text-4xl font-bold md:text-6xl">{bn ? "যোগাযোগ" : "Contact Us"}</h1>
    <dl className="mt-12 space-y-6">{rows.map(r => <div key={r[0]}><dt className="text-sm text-steel">{bn ? r[1] : r[0]}</dt><dd>{r[2]}</dd></div>)}</dl>
    <Link href={`/${locale}/quote`} className="mt-10 inline-block bg-amber px-6 py-3 font-medium text-navy">{bn ? "কোটেশন চান" : "Request a Quote"}</Link></main>);
}
