"use client";

import { useEffect, useRef } from "react";
import { gsap, stillPreferred } from "../lib/gsap";

/** A control that leans toward the pointer while it is near, and settles back when it leaves. */
export function Magnetic({ children, className, strength = 0.28 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || stillPreferred() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const target = el.firstElementChild as HTMLElement | null;
    if (!target) return;
    const xTo = gsap.quickTo(target, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(target, "y", { duration: 0.5, ease: "power3.out" });
    const move = (event: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((event.clientX - (r.left + r.width / 2)) * strength);
      yTo((event.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={["inline-block p-3 -m-3", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
