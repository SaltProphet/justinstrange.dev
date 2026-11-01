import { ContentIndex } from "@/components/content/content-index";
import { PageIntro } from "@/components/layout/page-intro";
import { getContent } from "@/lib/content";

export const metadata = { title: "Notes" };
export default function NotesPage() { return <div className="page shell"><PageIntro eyebrow="Notes / 05" title="Small observations." intro="Short-form references and fragments that are useful before they are finished enough to become an article." /><section className="section"><ContentIndex items={getContent("notes")} /></section></div>; }
