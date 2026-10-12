"use client";

import { useEffect, useRef, useState } from "react";
import { Stone } from "@/components/road";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";
import { Stamp } from "@/components/ui/stamp";
import { KIND_LABEL, ROAD, type Kind, type Party } from "@/lib/data";

const KINDS: Kind[] = ["home-loan", "treasury"];
const ACTS: Record<Party, string> = { you: "You act", easymarg: "EasyMarg acts", lender: "The lender acts" };

/*
  The road, walked by hand. Choose a service, then step from stone to stone:
  everything before the stone you are standing at is road travelled, everything
  after it is road ahead. The first time it comes into view it walks itself once.
*/
export function RoadExplorer() {
  const [kind, setKind] = useState<Kind>("home-loan");
  const [at, setAt] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const walking = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const road = ROAD[kind];
  const here = road[Math.min(at, road.length - 1)];

  const stop = () => clearInterval(walking.current);

  // Walk the road once on first sight. Any touch from the reader ends the walk.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        watcher.disconnect();
        walking.current = setInterval(() => {
          setAt((current) => {
            if (current >= ROAD["home-loan"].length - 1) {
              clearInterval(walking.current);
              return current;
            }
            return current + 1;
          });
        }, 1100);
      },
      { threshold: 0.45 },
    );
    watcher.observe(el);
    return () => {
      watcher.disconnect();
      clearInterval(walking.current);
    };
  }, []);

  const go = (index: number) => {
    stop();
    setAt(Math.max(0, Math.min(road.length - 1, index)));
  };

  return (
    <div ref={root}>
      <div role="group" aria-label="Service" className="inline-flex rounded-md border border-rule-2 p-1">
        {KINDS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={kind === option}
            onClick={() => {
              stop();
              setKind(option);
              setAt(0);
            }}
            className={`h-9 rounded-sm px-4 text-sm font-medium transition-colors duration-150 ${
              kind === option ? "bg-ink text-white" : "text-ink-2 hover:text-ink"
            }`}
          >
            {KIND_LABEL[option]}
          </button>
        ))}
      </div>

      <ol
        className="mt-10 grid md:[grid-template-columns:repeat(var(--stones),minmax(0,1fr))]"
        style={{ "--stones": road.length } as React.CSSProperties}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            event.preventDefault();
            go(at + 1);
          }
          if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            event.preventDefault();
            go(at - 1);
          }
        }}
      >
        {road.map((milestone, i) => {
          const state = i < at ? "passed" : i === at ? "here" : "ahead";
          const last = i === road.length - 1;
          return (
            <li key={milestone.key} className="relative">
              {!last && (
                <>
                  <span aria-hidden="true" className="road-ahead-y absolute top-[34px] bottom-0 left-[13px] w-[1.5px] md:hidden" />
                  <span
                    aria-hidden="true"
                    className={`absolute top-[34px] bottom-0 left-[13px] w-[1.5px] origin-top bg-ink transition-transform duration-500 ease-out md:hidden ${i < at ? "scale-y-100" : "scale-y-0"}`}
                  />
                  <span aria-hidden="true" className="road-ahead-x absolute top-[19px] right-0 left-[28px] hidden h-[1.5px] md:block" />
                  <span
                    aria-hidden="true"
                    className={`absolute top-[19px] right-0 left-[28px] hidden h-[1.5px] origin-left bg-ink transition-transform duration-500 ease-out md:block ${i < at ? "scale-x-100" : "scale-x-0"}`}
                  />
                </>
              )}
              <button
                type="button"
                aria-current={i === at ? "step" : undefined}
                onClick={() => go(i)}
                onMouseEnter={() => go(i)}
                className="group relative flex w-full items-start gap-4 pb-6 text-left md:block md:pr-5 md:pb-0"
              >
                <Stone n={i + 1} state={state} className="relative shrink-0 transition-transform duration-150 ease-out group-hover:-translate-y-0.5" />
                <span className="block min-w-0 md:mt-4">
                  <span
                    className={`block text-[0.9375rem] leading-snug font-semibold transition-colors duration-150 ${
                      state === "here" ? "text-blue" : state === "ahead" ? "text-ink-3 group-hover:text-ink" : "text-ink"
                    }`}
                  >
                    {milestone.title}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 border-t border-ink pt-6 md:mt-10" aria-live="polite">
        <div key={`${kind}-${at}`} className="settle grid gap-x-10 gap-y-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="t-label text-ink-3">
              Milestone {at + 1} of {road.length}
            </p>
            <h3 className="mt-2 text-[1.625rem] leading-tight font-semibold tracking-[-0.018em] [font-stretch:110%]">{here.title}</h3>
            <Stamp tone={here.who === "you" ? "blue" : "plain"} className="mt-4">
              {ACTS[here.who]}
            </Stamp>
          </div>
          <div className="md:col-span-5">
            <p className="t-label text-ink-3">What happens</p>
            <p className="mt-2 text-[1.0625rem] leading-relaxed text-ink">{here.what}</p>
          </div>
          <div className="md:col-span-3">
            <p className="t-label text-ink-3">Paper added to your record</p>
            <p className="mt-2 text-[1.0625rem] leading-relaxed text-ink">{here.paper}</p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(at - 1)}
            disabled={at === 0}
            aria-label="Previous milestone"
            className="inline-flex size-10 items-center justify-center rounded-md border border-rule-2 text-ink transition-colors duration-150 hover:border-ink disabled:pointer-events-none disabled:opacity-35"
          >
            <ArrowLeft />
          </button>
          <button
            type="button"
            onClick={() => go(at + 1)}
            disabled={at === road.length - 1}
            aria-label="Next milestone"
            className="inline-flex size-10 items-center justify-center rounded-md border border-rule-2 text-ink transition-colors duration-150 hover:border-ink disabled:pointer-events-none disabled:opacity-35"
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
