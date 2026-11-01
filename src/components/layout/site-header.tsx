"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { primaryNav, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="wordmark" href="/" aria-label={`${site.name} home`}>
          <span className="mark">JS</span>
          <span>{site.name}</span>
        </Link>
        <button className="menu-button" type="button" aria-label="Toggle navigation" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>Menu</button>
        <nav id="primary-navigation" className={`nav${open ? " open" : ""}`} aria-label="Primary navigation">
          {primaryNav.map((item) => {
            const active = pathname === item.href || (item.href !== "/about" && pathname.startsWith(`${item.href}/`));
            return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link>;
          })}
        </nav>
      </div>
    </header>
  );
}
