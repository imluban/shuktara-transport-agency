import Link from "next/link";
import "../globals.css";
import { logout } from "./actions";
export const metadata = { title: "Shuktara Admin", robots: { index: false } };
export default function A({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body><header className="flex items-center gap-6 border-b border-white/10 px-6 py-4 text-sm">
    <span className="font-semibold tracking-widest text-amber">SHUKTARA ADMIN</span>
    <Link href="/admin">Dashboard</Link><Link href="/admin/shipments">Shipments</Link><Link href="/admin/inquiries">Inquiries</Link><Link href="/admin/content">Content</Link><Link href="/admin/users">Users</Link>
    <form action={logout} className="ml-auto"><button className="text-steel">Sign out</button></form></header>
    <div className="mx-auto max-w-6xl p-6">{children}</div></body></html>);
}
