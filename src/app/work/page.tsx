import { ContentIndex } from "@/components/content/content-index";
import { PageIntro } from "@/components/layout/page-intro";
import { getContent } from "@/lib/content";

export const metadata = { title: "Work" };
export default function WorkPage() { return <div className="page shell"><PageIntro eyebrow="Work / 02" title="Documented work." intro="Projects are recorded as systems: their context, constraints, architecture, decisions, verification, and limits." /><section className="section"><div className="filters"><span className="filter active">All work</span><span className="filter">Systems architecture</span><span className="filter">Research tools</span><span className="filter">Prototype</span></div><ContentIndex items={getContent("projects")} /></section></div>; }
