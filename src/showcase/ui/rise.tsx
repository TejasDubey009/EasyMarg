"use client";

import { useEffect, useRef } from "react";
import { gsap, stillPreferred } from "../lib/gsap";

/** A block that rises into place once, when it scrolls into view. Children can stagger with `[data-rise]`. */
export function Rise({
  children,
  className,
  as: Tag = "div",
  stagger = 0.08,
  y = 28,
  start = "top 86%",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "ul" | "li" | "header" | "footer";
  stagger?: number;
  y?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || stillPreferred()) return;
    const items = el.querySelectorAll<HTMLElement>("[data-rise]");
    const targets = items.length ? Array.from(items) : [el];
    const tween = gsap.fromTo(
      targets,
      { autoAlpha: 0, y },
      { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger, scrollTrigger: { trigger: el, start, once: true } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [stagger, y, start]);

  // @ts-expect-error one ref across the allowed tags
  return <Tag ref={ref} className={className}>{children}</Tag>;
}
