import Link from "next/link";
import { ContentCard } from "@/components/content/content-card";
import { getContent } from "@/lib/content";

export default function Home() {
  const projects = getContent("projects").filter((item) => item.featured).slice(0, 2);
  const writing = getContent("articles").slice(0, 2);
  const experiments = getContent("experiments").slice(0, 1);
  return <>
    <section className="hero shell"><div className="hero-grid"><div><h1>Make the invisible structure visible.</h1><p className="lede">Justin Strange documents the systems, interfaces, and decisions behind complex work.</p></div><p className="hero-note">A working archive of architecture, experimentation, and technical writing. The output is less a showcase than a way to keep asking better questions.</p></div></section>
    <section className="section shell"><div className="section-head"><h2>Selected work</h2><Link className="text-link" href="/work">All work</Link></div><div className="grid grid-2">{projects.map((item) => <ContentCard item={item} key={item.slug} />)}</div></section>
    <section className="section shell"><div className="split"><div><h2>Systems that can explain themselves.</h2></div><div><p>Good architecture is not only a diagram or a technical choice. It is a shared model of constraints, responsibilities, evidence, and what happens when the model is wrong.</p><Link className="text-link" href="/approach">Read the approach</Link></div></div></section>
    <section className="section shell"><div className="section-head"><h2>Recent writing</h2><Link className="text-link" href="/writing">Writing archive</Link></div><div className="grid grid-2">{writing.map((item) => <ContentCard item={item} key={item.slug} />)}</div></section>
    <section className="section shell"><div className="section-head"><h2>In the lab</h2><Link className="text-link" href="/lab">View the lab</Link></div><div className="grid">{experiments.map((item) => <ContentCard item={item} key={item.slug} />)}</div></section>
  </>;
}
