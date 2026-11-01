import type { MetadataRoute } from "next";
import { getAllPublicContent } from "@/lib/content";
import { site } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap { const fixed = ["", "/work", "/writing", "/lab", "/about", "/approach", "/notes", "/now", "/uses", "/archive", "/search", "/contact"]; const dynamic = getAllPublicContent().map((item) => `/${item.kind === "projects" ? "work" : item.kind}/${item.slug}`); return [...fixed, ...dynamic].map((route) => ({ url: `${site.url}${route}`, lastModified: new Date() })); }
