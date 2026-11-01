import { notFound } from "next/navigation";
import { ContentBody } from "@/lib/markdown";
import { formatDate, getContent, getItem } from "@/lib/content";

export function generateStaticParams() { return getContent("projects").map((item) => ({ slug: item.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const item = getItem("projects", (await params).slug); return item ? { title: item.title, description: item.summary } : {}; }
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) { const item = getItem("projects", (await params).slug); if (!item) notFound(); return <article className="page shell"><header className="article-head"><div className="meta"><span>{item.category}</span><span className="status">{item.status}</span><span>{formatDate(item.date)}</span></div><h1>{item.title}</h1><p className="lede">{item.summary}</p></header><div className="prose"><ContentBody source={item.body} /></div></article>; }
