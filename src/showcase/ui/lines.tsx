"use client";

import { useEffect, useRef } from "react";
import { gsap, stillPreferred } from "../lib/gsap";

/*
  Text that arrives one line at a time. The words are measured after the fonts
  have loaded, grouped into the lines the browser actually set, and each line
  rises out of its own mask. On resize the lines are measured again; if the
  arrival has not played yet it is set up afresh, otherwise the text stays put.
*/
export function Lines({
  as = "p",
  children,
  className,
  delay = 0,
  stagger = 0.09,
  start = "top 85%",
}: {
  as?: "h1" | "h2" | "h3" | "p" | "span";
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const text = children;
    let cancelled = false;
    let played = false;
    let tween: gsap.core.Tween | undefined;
    let timer: ReturnType<typeof setTimeout>;

    const split = () => {
      el.textContent = "";
      const words = text.split(/\s+/).filter(Boolean);
      const probes = words.map((word) => {
        const s = document.createElement("span");
        s.textContent = word;
        s.style.display = "inline-block";
        el.appendChild(s);
        el.appendChild(document.createTextNode(" "));
        return s;
      });
      const lines: string[][] = [];
      let top = -1;
      probes.forEach((s, i) => {
        if (s.offsetTop !== top) {
          top = s.offsetTop;
          lines.push([]);
        }
        lines[lines.length - 1].push(words[i]);
      });
      el.textContent = "";
      return lines.map((line) => {
        const mask = document.createElement("span");
        mask.className = "line-mask";
        const inner = document.createElement("span");
        inner.className = "line-inner";
        inner.textContent = line.join(" ");
        mask.appendChild(inner);
        el.appendChild(mask);
        return inner;
      });
    };

    const build = () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
      tween = undefined;
      const inners = split();
      if (played || stillPreferred()) return;
      tween = gsap.fromTo(
        inners,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger,
          delay,
          scrollTrigger: { trigger: el, start, once: true },
          onComplete: () => {
            played = true;
          },
        },
      );
    };

    // Only a real change of window size can re-wrap the text; synthetic resize events are ignored.
    let seen = `${window.innerWidth}x${window.innerHeight}`;
    const onResize = () => {
      const now = `${window.innerWidth}x${window.innerHeight}`;
      if (now === seen) return;
      seen = now;
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!cancelled) build();
      }, 150);
    };

    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (cancelled) return;
      build();
      window.addEventListener("resize", onResize);
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      el.textContent = text;
    };
  }, [children, delay, stagger, start]);

  const Tag = as;
  return (
    // @ts-expect-error one ref across the allowed tags
    <Tag ref={ref} className={className} aria-label={children}>
      {children}
    </Tag>
  );
}
