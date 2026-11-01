import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import { formatDate } from "@/lib/content";

export function ContentIndex({ items }: { items: ContentItem[] }) {
  return (
    <div className="index-list">
      {items.map((item) => {
        const prefix = item.kind === "projects" ? "work" : item.kind;
        return <Link className="index-row" key={item.slug} href={`/${prefix}/${item.slug}`}>
          <div className="meta"><span>{formatDate(item.date)}</span></div>
          <div><h3>{item.title}</h3><p>{item.summary}</p></div>
          <div className="meta"><span>{item.category ?? item.kind}</span>{item.status && <span className="status">{item.status}</span>}</div>
        </Link>;
      })}
    </div>
  );
}
