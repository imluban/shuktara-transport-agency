import { t } from "@/i18n/config";
import Tracker from "./Tracker";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const d = t(locale).tracking;
  return (<main className="mx-auto max-w-2xl px-6 py-24">
    <h1 className="text-4xl font-bold md:text-6xl">{d.title}</h1>
    <p className="mb-10 mt-4 text-steel">{d.sub}</p>
    <Tracker d={d} /></main>);
}
