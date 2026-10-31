import QuoteForm from "@/components/QuoteForm";
export default async function Q({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (<main className="mx-auto max-w-4xl px-6 py-24"><h1 className="mb-10 text-4xl font-bold md:text-6xl">{locale === "bn" ? "কোটেশন চান" : "Request a Quote"}</h1><QuoteForm locale={locale} /></main>);
}
