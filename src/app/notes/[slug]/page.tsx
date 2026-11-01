import { notFound } from "next/navigation";
import { ContentBody } from "@/lib/markdown";
import { formatDate, getContent, getItem } from "@/lib/content";

export function generateStaticParams() { return getContent("notes").map((item) => ({ slug: item.slug })); }
export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) { const item = getItem("notes", (await params).slug); if (!item) notFound(); return <article className="page shell"><header className="article-head"><div className="meta"><span>Note</span><span>{formatDate(item.date)}</span></div><h1>{item.title}</h1><p className="lede">{item.summary}</p></header><div className="prose"><ContentBody source={item.body} /></div></article>; }
