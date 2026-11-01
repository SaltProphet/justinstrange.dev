import Link from "next/link";
export default function NotFound() { return <div className="not-found shell"><div><h1>This path is still being mapped.</h1><p className="lede">The page you requested does not exist in the public archive.</p><Link className="button" href="/">Return home</Link></div></div>; }
