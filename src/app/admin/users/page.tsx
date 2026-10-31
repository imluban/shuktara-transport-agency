import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { grantRole, revokeRole } from "../actions";
export const dynamic = "force-dynamic";
const M: Record<string, string> = { nouser: "No Supabase Auth user has that email. Create the user in Supabase Auth first.", self: "You cannot remove your own role." };
export default async function U({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams; const { db, role } = await requireAdmin(); if (role !== "admin") redirect("/admin?e=forbidden");
  const { data: roles } = await db.from("user_roles").select("user_id,role");
  const { data: us } = await db.auth.admin.listUsers({ perPage: 1000 }); const em = Object.fromEntries((us?.users ?? []).map(u => [u.id, u.email]));
  return (<div><h1 className="mb-6 text-3xl font-bold">Users & roles</h1>{e && <p role="alert" className="mb-4 text-amber">{M[e]}</p>}
    <form action={grantRole} className="mb-8 flex flex-wrap gap-2"><input name="email" type="email" required placeholder="user@example.com" className="border border-white/20 bg-charcoal px-2 py-1 text-white" />
      <select name="role" className="border border-white/20 bg-charcoal px-2 py-1"><option>staff</option><option>admin</option></select><button className="bg-amber px-4 py-1 font-medium text-navy">Grant / change role</button></form>
    {(roles ?? []).map((r: any) => (<form key={r.user_id} action={revokeRole} className="flex items-center gap-4 border-b border-white/10 py-2 text-sm">
      <span className="flex-1">{em[r.user_id] ?? r.user_id}</span><span className="text-steel">{r.role}</span><input type="hidden" name="user_id" value={r.user_id} /><button className="text-amber">Remove</button></form>))}</div>);
}
