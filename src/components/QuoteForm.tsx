"use client";
import { useState } from "react";
const L = {
 en: { full_name: "Full Name", company: "Company Name", email: "Email", phone: "Phone (+880…)", service: "Service", cargo_type: "Cargo Type", pickup: "Pickup Location (district/city)", destination: "Destination (district/city)", volume: "Estimated Cargo Volume", preferred_date: "Preferred Date", details: "Additional Requirements", send: "Send Request", ok: "Your request was received.", fail: "Could not submit. Please check the fields and try again.", off: "Quote submission is not available yet. Please try later.", rate: "Too many attempts. Please wait." },
 bn: { full_name: "পূর্ণ নাম", company: "প্রতিষ্ঠানের নাম", email: "ইমেইল", phone: "ফোন (+৮৮০…)", service: "সেবা", cargo_type: "কার্গোর ধরন", pickup: "পিকআপ স্থান (জেলা/শহর)", destination: "গন্তব্য (জেলা/শহর)", volume: "আনুমানিক কার্গো পরিমাণ", preferred_date: "পছন্দের তারিখ", details: "অতিরিক্ত চাহিদা", send: "অনুরোধ পাঠান", ok: "আপনার অনুরোধ গৃহীত হয়েছে।", fail: "জমা দেওয়া যায়নি। তথ্য যাচাই করে আবার চেষ্টা করুন।", off: "কোটেশন জমা এখনো চালু নয়। পরে চেষ্টা করুন।", rate: "অনেকবার চেষ্টা হয়েছে। অপেক্ষা করুন।" },
};
const svc: [string, string, string][] = [["petroleum","Oil & Petroleum","তেল ও পেট্রোলিয়াম"],["road_freight","Road Freight","সড়ক পরিবহন"],["marine","Marine","নৌ পরিবহন"],["industrial","Industrial Logistics","শিল্প লজিস্টিকস"],["cargo","Cargo Transportation","কার্গো পরিবহন"],["warehousing","Warehousing","গুদামজাতকরণ"],["other","Other","অন্যান্য"]];
export default function QuoteForm({ locale }: { locale: string }) {
  const bn = locale === "bn", d = bn ? L.bn : L.en;
  const [state, setState] = useState<"idle"|"busy"|"ok"|"err">("idle"); const [msg, setMsg] = useState(""); const [errs, setErrs] = useState<Record<string, string[]>>({});
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState("busy"); setErrs({});
    const body = Object.fromEntries([...new FormData(e.currentTarget)].filter(([, v]) => v !== ""));
    try {
      const r = await fetch("/api/quotes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (r.status === 201) { setState("ok"); setMsg(d.ok); e.currentTarget.reset(); return; }
      const j = await r.json().catch(() => ({})); if (j.fields) setErrs(j.fields);
      setState("err"); setMsg(r.status === 503 ? d.off : r.status === 429 ? d.rate : d.fail);
    } catch { setState("err"); setMsg(d.fail); }
  }
  const f = (n: keyof typeof L.en, type = "text", req = false) => (
    <div><label htmlFor={n} className="mb-1 block text-sm text-steel">{d[n]}{req && " *"}</label>
      <input id={n} name={n} type={type} required={req} aria-invalid={!!errs[n]} className="w-full border border-white/20 bg-charcoal px-3 py-2" />
      {errs[n] && <p className="text-sm text-amber">{errs[n]![0]}</p>}</div>);
  return (<form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
    {f("full_name", "text", true)}{f("company")}{f("email", "email", true)}{f("phone", "tel", true)}
    <div><label htmlFor="service" className="mb-1 block text-sm text-steel">{d.service} *</label>
      <select id="service" name="service" required className="w-full border border-white/20 bg-charcoal px-3 py-2">{svc.map(s => <option key={s[0]} value={s[0]}>{bn ? s[2] : s[1]}</option>)}</select></div>
    {f("cargo_type")}{f("pickup", "text", true)}{f("destination", "text", true)}{f("volume")}{f("preferred_date", "date")}
    <div className="md:col-span-2"><label htmlFor="details" className="mb-1 block text-sm text-steel">{d.details}</label><textarea id="details" name="details" rows={4} className="w-full border border-white/20 bg-charcoal px-3 py-2" /></div>
    <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
    <div className="md:col-span-2"><button disabled={state === "busy"} className="bg-amber px-8 py-3 font-medium text-navy disabled:opacity-50">{d.send}</button>
      <p role="status" className={`mt-4 ${state === "ok" ? "text-steel" : "text-amber"}`}>{msg}</p></div>
  </form>);
}
