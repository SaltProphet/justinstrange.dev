import { PageIntro } from "@/components/layout/page-intro";

export function SimplePage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return <div className="page shell"><PageIntro eyebrow={eyebrow} title={title} intro={intro} /><section className="section"><div className="prose" style={{ marginTop: 0 }}>{children}</div></section></div>;
}
