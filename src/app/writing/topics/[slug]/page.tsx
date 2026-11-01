import { notFound } from "next/navigation";
import { ContentIndex } from "@/components/content/content-index";
import { PageIntro } from "@/components/layout/page-intro";
import { getContent } from "@/lib/content";

export function generateStaticParams() { return [...new Set(getContent("articles").flatMap((item) => item.tags))].map((slug) => ({ slug })); }
export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) { const slug = (await params).slug; const items = getContent("articles").filter((item) => item.tags.includes(slug)); if (!items.length) notFound(); return <div className="page shell"><PageIntro eyebrow="Writing / Topic" title={slug} intro={`Writing connected to ${slug}.`} /><section className="section"><ContentIndex items={items} /></section></div>; }
