import { notFound } from "next/navigation";
import { ContentBody } from "@/lib/markdown";
import { formatDate, getContent, getItem } from "@/lib/content";

export function generateStaticParams() { return getContent("experiments").map((item) => ({ slug: item.slug })); }
export default async function ExperimentPage({ params }: { params: Promise<{ slug: string }> }) { const item = getItem("experiments", (await params).slug); if (!item) notFound(); return <article className="page shell"><header className="article-head"><div className="meta"><span>Experiment</span><span className="status">{item.status}</span><span>{formatDate(item.date)}</span></div><h1>{item.title}</h1><p className="lede">{item.summary}</p></header><div className="prose"><ContentBody source={item.body} /></div></article>; }
