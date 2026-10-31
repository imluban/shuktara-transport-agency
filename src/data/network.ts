// ILLUSTRATIVE geography only. None of these are confirmed Shuktara offices, facilities or routes.
export type Place = { id: string; en: string; bn: string; pos: [number, number]; port?: boolean };
export const places: Place[] = [
  { id: "dhaka", en: "Dhaka", bn: "ঢাকা", pos: [23.8103, 90.4125] },
  { id: "ctg", en: "Chattogram", bn: "চট্টগ্রাম", pos: [22.3569, 91.7832], port: true },
  { id: "khulna", en: "Khulna", bn: "খুলনা", pos: [22.8456, 89.5403] },
  { id: "mongla", en: "Mongla", bn: "মংলা", pos: [22.47, 89.6], port: true },
  { id: "barishal", en: "Barishal", bn: "বরিশাল", pos: [22.701, 90.3535] },
  { id: "sylhet", en: "Sylhet", bn: "সিলেট", pos: [24.8949, 91.8687] },
  { id: "rajshahi", en: "Rajshahi", bn: "রাজশাহী", pos: [24.3745, 88.6042] },
  { id: "rangpur", en: "Rangpur", bn: "রংপুর", pos: [25.7439, 89.2752] },
  { id: "cumilla", en: "Cumilla", bn: "কুমিল্লা", pos: [23.4607, 91.1809] },
];
export const routes: { kind: "road" | "marine"; from: string; to: string }[] = [
  { kind: "road", from: "dhaka", to: "ctg" }, { kind: "road", from: "dhaka", to: "khulna" }, { kind: "road", from: "dhaka", to: "sylhet" },
  { kind: "road", from: "dhaka", to: "rajshahi" }, { kind: "road", from: "rajshahi", to: "rangpur" }, { kind: "road", from: "dhaka", to: "cumilla" },
  { kind: "marine", from: "ctg", to: "mongla" }, { kind: "marine", from: "mongla", to: "barishal" },
];
