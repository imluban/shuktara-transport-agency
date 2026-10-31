import Image from "next/image";
import { photoSrc } from "@/lib/photo";
export default function Photo({ name, alt = "", className = "", priority = false }: { name: string; alt?: string; className?: string; priority?: boolean }) {
  const src = photoSrc(name);
  return (<div className={`relative overflow-hidden bg-charcoal ${className}`}><Image src={src} alt={alt} fill sizes="(min-width:768px) 50vw, 100vw" priority={priority} unoptimized={src.endsWith(".svg")} className="object-cover" /></div>);
}
