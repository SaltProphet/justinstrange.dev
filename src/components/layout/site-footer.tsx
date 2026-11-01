import Link from "next/link";
import { supportingNav } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="footer shell">
      <div className="footer-top">
        <div>
          <h2>Good systems make room for better questions.</h2>
        </div>
        <nav className="footer-links" aria-label="Supporting navigation">
          {supportingNav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Justin Strange</span><span>Built as a living system</span></div>
    </footer>
  );
}
