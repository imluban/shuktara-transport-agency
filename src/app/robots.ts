export default function robots() { const u = process.env.NEXT_PUBLIC_SITE_URL ?? ""; return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }, sitemap: `${u}/sitemap.xml` }; }
