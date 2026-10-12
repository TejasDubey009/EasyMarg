"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/*
  Lets a block rise into place the first time it scrolls into view.

  The block is visible until the script runs, so the page reads fine without
  it. Only blocks still below the fold are hidden, and each plays once. The
  state lives on the element (data-reveal="out" | "in") so that children such
  as a strike-through or a filling bar can key their own motion off it.
*/
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Milliseconds to wait after entering view. Use to stagger siblings. */
  delay?: number;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      el.dataset.reveal = "in";
      return;
    }
    el.dataset.reveal = "out";
    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "in";
        watcher.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    watcher.observe(el);
    return () => watcher.disconnect();
  }, []);

  return (
    // @ts-expect-error one ref type across the three allowed tags
    <Tag ref={ref} className={className} style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}>
      {children}
    </Tag>
  );
}
