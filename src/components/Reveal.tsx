"use client";
import { motion, useReducedMotion } from "framer-motion";
export default function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const r = useReducedMotion();
  return (<motion.div className={className} initial={r ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>);
}
