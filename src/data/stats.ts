// EDITABLE. Entries stay hidden until the company supplies a verified value and sets published: true.
export type Stat = { en: string; bn: string; value: number | null; suffix?: string; published: boolean };
export const stats: Stat[] = [
  { en: "Years of Experience", bn: "অভিজ্ঞতার বছর", value: null, suffix: "+", published: false },
  { en: "Fleet Size", bn: "ফ্লিটের আকার", value: null, published: false },
  { en: "Service Regions", bn: "সেবা অঞ্চল", value: null, published: false },
  { en: "Client Partnerships", bn: "ক্লায়েন্ট অংশীদারিত্ব", value: null, published: false },
];
export type Testimonial = { quote: { en: string; bn: string }; name: string; role: string; company: string; published: boolean };
// Only add REAL, consented client feedback here. Empty by default; nothing is shown until published: true.
export const testimonials: Testimonial[] = [];
