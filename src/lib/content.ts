import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ContentKind = "projects" | "articles" | "experiments" | "notes";
export type ProjectStatus = "Concept" | "Prototype" | "In Development" | "Operational" | "Archived";

export type ContentItem = {
  kind: ContentKind;
  title: string;
  slug: string;
  summary: string;
  visibility: "public" | "draft";
  date: string;
  tags: string[];
  category?: string;
  status?: ProjectStatus;
  featured?: boolean;
  readingTime?: string;
  body: string;
};

const contentRoot = path.join(process.cwd(), "content");

function collectionPath(kind: ContentKind) {
  return path.join(contentRoot, kind);
}

function parseItem(kind: ContentKind, filename: string): ContentItem {
  const source = fs.readFileSync(path.join(collectionPath(kind), filename), "utf8");
  const { data, content } = matter(source);
  if (!data.title || !data.slug || !data.summary || !data.visibility || !data.date || !data.tags) {
    throw new Error(`Invalid frontmatter in ${kind}/${filename}`);
  }
  return {
    kind,
    title: String(data.title),
    slug: String(data.slug),
    summary: String(data.summary),
    visibility: data.visibility,
    date: String(data.date),
    tags: data.tags,
    category: data.category,
    status: data.status,
    featured: data.featured,
    readingTime: data.readingTime,
    body: content.trim(),
  };
}

export function getContent(kind: ContentKind, includeDrafts = false) {
  const directory = collectionPath(kind);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => parseItem(kind, filename))
    .filter((item) => includeDrafts || item.visibility === "public")
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getItem(kind: ContentKind, slug: string) {
  return getContent(kind).find((item) => item.slug === slug);
}

export function getAllPublicContent() {
  return (["projects", "articles", "experiments", "notes"] as ContentKind[]).flatMap((kind) => getContent(kind));
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}
