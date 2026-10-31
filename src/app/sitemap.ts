import { pages } from "@/data/content";
export default function sitemap() { const u = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const paths = ["", "tracking", "quote", "contact", "network", ...Object.keys(pages), ...pages.services.items.map(i => `services/${i[0]}`)];
  return ["en", "bn"].flatMap(l => paths.map(p => ({ url: `${u}/${l}${p ? "/" + p : ""}`, alternates: { languages: { en: `${u}/en${p ? "/" + p : ""}`, bn: `${u}/bn${p ? "/" + p : ""}` } } }))); }
