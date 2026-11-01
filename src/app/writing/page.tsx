import { ContentIndex } from "@/components/content/content-index";
import { PageIntro } from "@/components/layout/page-intro";
import { getContent } from "@/lib/content";

export const metadata = { title: "Writing" };
export default function WritingPage() { return <div className="page shell"><PageIntro eyebrow="Writing / 03" title="Independent writing." intro="Essays and technical articles about architecture, interfaces, decisions, and the practice of making complex work legible." /><section className="section"><div className="filters"><span className="filter active">All writing</span><span className="filter">Architecture</span><span className="filter">Systems</span><span className="filter">Interfaces</span></div><ContentIndex items={getContent("articles")} /></section></div>; }
