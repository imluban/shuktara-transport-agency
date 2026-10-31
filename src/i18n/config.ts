import { en } from "./en"; import { bn } from "./bn";
export const locales = ["en","bn"] as const;
export type Locale = (typeof locales)[number];
export const dict = { en, bn };
export const t = (l: string) => dict[(locales as readonly string[]).includes(l) ? (l as Locale) : "en"];
