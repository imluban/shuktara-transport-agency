import { NextRequest, NextResponse } from "next/server";
const locales = ["en","bn"];
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api") || pathname.startsWith("/admin") || pathname.includes(".")) return;
  if (locales.some(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const pref = req.cookies.get("lang")?.value;
  const l = pref && locales.includes(pref) ? pref : "en";
  return NextResponse.redirect(new URL(`/${l}${pathname === "/" ? "" : pathname}`, req.url));
}
export const config = { matcher: ["/((?!_next|favicon.ico).*)"] };
