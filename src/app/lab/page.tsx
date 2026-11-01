import { ContentIndex } from "@/components/content/content-index";
import { PageIntro } from "@/components/layout/page-intro";
import { getContent } from "@/lib/content";

export const metadata = { title: "Lab" };
export default function LabPage() { return <div className="page shell"><PageIntro eyebrow="Lab / 04" title="Unfinished on purpose." intro="Experiments are where hypotheses get a place to be tested before they become claims. Each record keeps the setup, observations, and uncertainty visible." /><section className="section"><ContentIndex items={getContent("experiments")} /></section></div>; }
