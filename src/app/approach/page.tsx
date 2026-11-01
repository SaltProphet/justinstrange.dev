import Link from "next/link";
import { SimplePage } from "@/components/layout/simple-page";
export const metadata = { title: "Approach" };
export default function ApproachPage() { return <SimplePage eyebrow="Approach / 07" title="Investigate before you optimize." intro="A systems practice begins by making the situation legible: what exists, what is constrained, and what evidence is missing."><p>The work moves from context to structure to a testable decision. The goal is not to produce certainty on demand, but to make uncertainty explicit enough to work with.</p><p><Link className="text-link" href="/approach/architecture">Architecture principles</Link> <span> · </span><Link className="text-link" href="/approach/process">Process and verification</Link></p></SimplePage>; }
