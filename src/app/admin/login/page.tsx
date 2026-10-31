import { login } from "../actions";
const M: Record<string, string> = { bad: "Invalid email or password.", denied: "This account has no admin access.", config: "Supabase is not configured (see README)." };
export default async function L({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  return (<form action={login} className="mx-auto mt-24 max-w-sm space-y-4"><h1 className="text-2xl font-bold">Admin sign in</h1>
    <label className="block text-sm text-steel">Email<input name="email" type="email" required autoComplete="username" className="mt-1 w-full border border-white/20 bg-charcoal px-3 py-2 text-white" /></label>
    <label className="block text-sm text-steel">Password<input name="password" type="password" required autoComplete="current-password" className="mt-1 w-full border border-white/20 bg-charcoal px-3 py-2 text-white" /></label>
    <button className="w-full bg-amber py-2 font-medium text-navy">Sign in</button><p role="alert" className="text-amber">{e && M[e]}</p></form>);
}
