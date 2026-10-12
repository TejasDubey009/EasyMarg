"use client";

import { useEffect, useRef } from "react";

/*
  React Three Fiber sizes its canvas from a ResizeObserver on its wrapper. In
  this app the observer's first notification sometimes never arrives, and the
  canvas sits at the browser default of 300×150. Two remedies, in order: nudge
  the wrapper by a pixel so the observer has something to report; and if the
  canvas is still unsized after that, fire a window resize, which the
  measurement library always listens for.
*/
export function useMeasureNudge<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    const unsized = () => {
      const canvas = el.querySelector("canvas");
      return !!canvas && canvas.width <= 300 && canvas.height <= 150 && el.clientWidth > 300;
    };
    const nudge = () => {
      el.style.paddingBottom = "1px";
      later(() => {
        el.style.paddingBottom = "";
      }, 40);
    };
    const insist = () => {
      if (unsized()) window.dispatchEvent(new Event("resize"));
    };

    const frame = requestAnimationFrame(nudge);
    later(nudge, 300);
    [700, 1600, 3200].forEach((ms) => later(insist, ms));
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      el.style.paddingBottom = "";
    };
  }, []);
  return ref;
}
