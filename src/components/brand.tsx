import Link from "next/link";

/*
  Provisional wordmark, set in the display cut of the site typeface.
  The mark is a milestone: the stone that tells you how far along the road you are.
  Swap for the registered EasyMarg logo when the artwork is available.
*/

export function Mark({ tone = "ink", className }: { tone?: "ink" | "white" | "current"; className?: string }) {
  const line = tone === "white" ? "stroke-white" : tone === "current" ? "stroke-current" : "stroke-ink";
  const cap = tone === "white" ? "fill-white" : tone === "current" ? "fill-current" : "fill-blue";
  return (
    <svg viewBox="0 0 28 34" width="19" height="23" aria-hidden="true" className={className}>
      <path d="M2 14a12 12 0 0 1 24 0Z" className={cap} />
      <path d="M2 32V14a12 12 0 0 1 24 0v18Z" fill="none" strokeWidth="2.5" strokeLinejoin="round" className={line} />
      <path d="M2 14h24" strokeWidth="2.5" className={line} />
    </svg>
  );
}

export function Wordmark({ tone = "ink", href = "/" }: { tone?: "ink" | "white"; href?: string }) {
  return (
    <Link
      href={href}
      aria-label="EasyMarg, home"
      className={`inline-flex items-center gap-2.5 rounded-xs ${tone === "white" ? "text-white" : "text-ink"}`}
    >
      <Mark tone={tone} />
      <span className="text-[1.1875rem] leading-none font-semibold tracking-[-0.02em] [font-stretch:112%]">EasyMarg</span>
    </Link>
  );
}
