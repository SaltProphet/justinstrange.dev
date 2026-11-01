export function PageIntro({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <header className="article-head"><h1>{title}</h1><p className="lede">{intro}</p></header>;
}
