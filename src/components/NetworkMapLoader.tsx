"use client";
import dynamic from "next/dynamic";
const M = dynamic(() => import("./NetworkMap"), { ssr: false, loading: () => <div className="h-[28rem] animate-pulse bg-charcoal" /> });
export default function Loader({ locale }: { locale: string }) { return <M locale={locale} />; }
