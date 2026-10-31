"use client";
import { useEffect, useState } from "react";
export default function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(to);
    const s = performance.now(); let raf = 0;
    const tick = (t: number) => { const p = Math.min(1, (t - s) / 1200); setN(Math.round(to * p)); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span>{n}{suffix}</span>;
}
