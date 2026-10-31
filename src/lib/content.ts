import { z } from "zod";
import { unstable_cache } from "next/cache";
import { adminDb } from "./supabase";
const s = (n: number) => z.string().trim().max(n);
const bi = z.object({ en: s(600), bn: s(600) });
const item = z.array(z.tuple([z.string().regex(/^[a-z0-9-]{1,60}$/), s(120), s(120), s(400), s(400)])).max(30);
export const schemas = {
  services: item, fleet: item, industries: item,
  stats: z.array(z.object({ en: s(60), bn: s(60), value: z.number().nonnegative().nullable(), suffix: s(5).optional(), published: z.boolean() })
    .refine(x => !x.published || x.value !== null, "A published stat needs a value")),
  testimonials: z.array(z.object({ quote: bi, name: s(100), role: s(100), company: s(100), published: z.boolean() })),
  company: z.object({ address: s(300), phone: s(60), email: s(120), hours: s(200) }),
};
export type ContentKey = keyof typeof schemas;
export function getContent<K extends ContentKey>(key: K, fallback: z.infer<(typeof schemas)[K]>): Promise<z.infer<(typeof schemas)[K]>> {
  return unstable_cache(async () => {
    const db = adminDb(); if (!db) return fallback;
    const { data } = await db.from("site_content").select("value").eq("key", key).maybeSingle();
    const p = schemas[key].safeParse(data?.value); return p.success ? (p.data as any) : fallback;
  }, ["content", key], { tags: ["content:" + key], revalidate: 300 })();
}
