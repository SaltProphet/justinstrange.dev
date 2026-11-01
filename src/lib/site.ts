export const site = {
  name: "Justin Strange",
  shortName: "JS",
  description:
    "A systems architecture portfolio documenting how complex work is investigated, designed, and made legible.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const primaryNav = [
  { label: "Work", href: "/work" },
  { label: "Writing", href: "/writing" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const supportingNav = [
  { label: "Approach", href: "/approach" },
  { label: "Notes", href: "/notes" },
  { label: "Now", href: "/now" },
  { label: "Uses", href: "/uses" },
  { label: "Archive", href: "/archive" },
  { label: "Search", href: "/search" },
];
