"use server";
import { z } from "zod";
import { STATUSES } from "@/lib/statuses";
import { revalidateTag } from "next/cache";
import { schemas, type ContentKey } from "@/lib/content";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin, sb } from "@/lib/auth";
const st = z.enum(STATUSES);
const log = (db: any, uid: string, action: string, entity: string, id: string) => db.from("admin_activity_logs").insert({ user_id: uid, action, entity, entity_id: id });

export async function login(fd: FormData) {
  const { error } = await (await sb()).auth.signInWithPassword({ email: String(fd.get("email")), password: String(fd.get("password")) });
  redirect(error ? "/admin/login?e=bad" : "/admin");
}
export async function logout() { await (await sb()).auth.signOut(); redirect("/admin/login"); }

export async function createShipment(fd: FormData) {
  const { db, user } = await requireAdmin();
  const p = z.object({ shipment_type: z.string().trim().min(2).max(100), origin: z.string().trim().min(2).max(150), destination: z.string().trim().min(2).max(150),
    customer_name: z.string().trim().max(150).optional(), customer_phone: z.string().trim().max(30).optional(), dispatch_date: z.string().date().optional(), estimated_delivery_date: z.string().date().optional() })
    .parse(Object.fromEntries([...fd].filter(([, v]) => v !== "")));
  const { data, error } = await db.from("shipments").insert(p).select("id").single();
  if (error) throw new Error("Could not create shipment");
  await db.from("shipment_events").insert({ shipment_id: data.id, status: "booking_received", location: p.origin, description: "Booking received" });
  await log(db, user.id, "create", "shipment", data.id); revalidatePath("/admin/shipments");
}
export async function addEvent(fd: FormData) {
  const { db, user } = await requireAdmin();
  const p = z.object({ shipment_id: z.string().uuid(), status: st, location: z.string().trim().max(150).optional(), description: z.string().trim().max(500).optional() })
    .parse(Object.fromEntries([...fd].filter(([, v]) => v !== "")));
  const { error } = await db.from("shipment_events").insert(p); if (error) throw new Error("Could not add event");
  await db.from("shipments").update({ status: p.status, updated_at: new Date().toISOString(), ...(p.status === "delivered" ? { delivered_at: new Date().toISOString() } : {}) }).eq("id", p.shipment_id);
  await log(db, user.id, "event:" + p.status, "shipment", p.shipment_id); revalidatePath("/admin/shipments"); revalidatePath("/admin");
}
export async function updateQuote(fd: FormData) {
  const { db, user } = await requireAdmin();
  const p = z.object({ id: z.string().uuid(), status: z.enum(["new","in_review","quoted","closed"]), internal_notes: z.string().max(2000).optional() }).parse(Object.fromEntries(fd));
  await db.from("quote_requests").update({ status: p.status, internal_notes: p.internal_notes ?? null }).eq("id", p.id);
  await log(db, user.id, "update", "quote", p.id); revalidatePath("/admin/inquiries"); revalidatePath("/admin");
}

export async function saveContent(fd: FormData) {
  const { db, user } = await requireAdmin();
  const key = String(fd.get("key")) as ContentKey;
  if (!(key in schemas)) redirect("/admin/content?e=key");
  let json: unknown; try { json = JSON.parse(String(fd.get("value"))); } catch { redirect(`/admin/content?e=${key}-json`); }
  const p = schemas[key].safeParse(json); if (!p.success) redirect(`/admin/content?e=${key}-invalid`);
  await db.from("site_content").upsert({ key, value: p.data, updated_by: user.id, updated_at: new Date().toISOString() });
  await log(db, user.id, "content", "site_content", key); revalidateTag("content:" + key); redirect(`/admin/content?ok=${key}`);
}
async function adminOnly() { const a = await requireAdmin(); if (a.role !== "admin") redirect("/admin?e=forbidden"); return a; }
export async function grantRole(fd: FormData) {
  const { db, user } = await adminOnly();
  const p = z.object({ email: z.string().email(), role: z.enum(["admin", "staff"]) }).parse(Object.fromEntries(fd));
  const { data } = await db.auth.admin.listUsers({ perPage: 1000 });
  const u = data?.users.find(x => x.email?.toLowerCase() === p.email.toLowerCase()); if (!u) redirect("/admin/users?e=nouser");
  await db.from("user_roles").upsert({ user_id: u.id, role: p.role }); await log(db, user.id, "grant:" + p.role, "user", u.id); revalidatePath("/admin/users");
}
export async function revokeRole(fd: FormData) {
  const { db, user } = await adminOnly(); const id = z.string().uuid().parse(fd.get("user_id"));
  if (id === user.id) redirect("/admin/users?e=self");
  await db.from("user_roles").delete().eq("user_id", id); await log(db, user.id, "revoke", "user", id); revalidatePath("/admin/users");
}
