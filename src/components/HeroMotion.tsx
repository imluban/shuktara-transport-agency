"use client";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
export function HeroBackdrop({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null); const r = useReducedMotion();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !ref.current) return;
    let ctx: { revert: () => void } | undefined, dead = false;
    (async () => {
      const { gsap } = await import("gsap"); const { ScrollTrigger } = await import("gsap/ScrollTrigger"); if (dead) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => { gsap.to(ref.current, { yPercent: 12, ease: "none", scrollTrigger: { trigger: ref.current!.parentElement, start: "top top", end: "bottom top", scrub: true } }); });
    })();
    return () => { dead = true; ctx?.revert(); };
  }, []);
  return (<div ref={ref} className="absolute inset-[-10%]"><motion.div className="h-full w-full" initial={r ? false : { scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2.6, ease: "easeOut" }}>{children}</motion.div></div>);
}
export function HeroText({ children }: { children: React.ReactNode }) {
  const r = useReducedMotion();
  return (<motion.section className="relative max-w-5xl" initial={r ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.section>);
}
