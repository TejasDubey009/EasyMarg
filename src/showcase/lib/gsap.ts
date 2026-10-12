"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  if (process.env.NODE_ENV !== "production") {
    // So the triggers can be inspected from the console while developing.
    (window as unknown as { __st: typeof ScrollTrigger }).__st = ScrollTrigger;
  }
}

/** True when the visitor has asked for less motion. Safe to call during render on the client. */
export function stillPreferred(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
