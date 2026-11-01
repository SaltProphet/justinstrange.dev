import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import { formatDate } from "@/lib/content";

export function ContentCard({ item }: { item: ContentItem }) {
  const prefix = item.kind === "projects" ? "work" : item.kind;
  return (
    <Link className="card" href={`/${prefix}/${item.slug}`}>
      <div>
        <div className="meta"><span>{item.category ?? item.kind}</span>{item.status && <span className="status">{item.status}</span>}</div>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
      </div>
      <div className="meta"><span>{formatDate(item.date)}</span>{item.tags.slice(0, 2).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
    </Link>
  );
}
