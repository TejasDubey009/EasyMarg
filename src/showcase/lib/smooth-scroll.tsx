"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger, stillPreferred } from "./gsap";

/*
  Inertial scrolling, driven from GSAP's ticker so that ScrollTrigger and the
  3D scenes read one clock. Turned off entirely for reduced motion.
*/
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (stillPreferred()) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, anchors: { offset: -72 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
