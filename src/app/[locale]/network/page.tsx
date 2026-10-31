import NetworkMapLoader from "@/components/NetworkMapLoader";
export default async function N({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const bn = locale === "bn";
  return (<main className="mx-auto max-w-6xl px-6 py-24">
    <h1 className="text-4xl font-bold md:text-6xl">{bn ? "বাংলাদেশ লজিস্টিকস নেটওয়ার্ক" : "Bangladesh Logistics Network"}</h1>
    <p className="mb-10 mt-6 max-w-2xl text-steel">{bn ? "বাংলাদেশের প্রধান শহর, বন্দর ও পরিবহন করিডোরের দৃষ্টান্তমূলক চিত্র। কোম্পানির যাচাইকৃত নেটওয়ার্ক পাওয়া গেলে এখানে যুক্ত হবে।" : "An illustrative view of Bangladesh's major cities, ports and transport corridors. The company's verified operating network will be added here once confirmed."}</p>
    <NetworkMapLoader locale={locale} /></main>);
}
