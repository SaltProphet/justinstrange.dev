import { SimplePage } from "@/components/layout/simple-page";
export const metadata = { title: "Now" };
export default function NowPage() { return <SimplePage eyebrow="Now / 08" title="Current focus." intro="A small snapshot of what is being investigated and built right now."><div className="callout"><p><strong>Current question:</strong> how can a personal knowledge system preserve uncertainty without becoming too slow to use?</p></div><p>Working through content models, visual evidence, and lightweight tools for turning observations into durable artifacts.</p></SimplePage>; }
