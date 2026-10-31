import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminDb } from "./supabase";
export async function sb() {
  const c = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => c.getAll(), setAll: (l: { name: string; value: string; options?: any }[]) => { try { l.forEach(x => c.set(x.name, x.value, x.options)); } catch {} } } });
}
// Server-side authorization: valid session AND a row in user_roles. Used by every admin page and action.
export async function requireAdmin() {
  const db = adminDb(); if (!db) redirect("/admin/login?e=config");
  const { data: { user } } = await (await sb()).auth.getUser();
  if (!user) redirect("/admin/login");
  const { data } = await db.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
  if (!data) redirect("/admin/login?e=denied");
  return { user, db, role: data.role as string };
}
