import fs from "fs";
import path from "path";
// A real photo (public/images/<name>.jpg) wins over the generated placeholder artwork (<name>.svg).
export const photoSrc = (name: string) => `/images/${name}.${fs.existsSync(path.join(process.cwd(), "public/images", `${name}.jpg`)) ? "jpg" : "svg"}`;
export const sceneFor = (slug: string) => (({ petroleum: "hero", "road-freight": "road", marine: "marine", industrial: "industrial", cargo: "port", warehousing: "warehouse",
  "oil-gas": "industrial", energy: "industrial", manufacturing: "industrial", construction: "road", maritime: "port", commercial: "warehouse" }) as Record<string, string>)[slug] ?? "hero";
