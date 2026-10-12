import type { Milestone, Party } from "@/lib/data";
import { day } from "@/lib/format";

/*
  The road (marg) and its milestones.
  A stone is drawn the way a roadside milestone is: a rounded cap over a numbered body.
  The road behind you is a solid line. The road ahead is a dashed centre line.
*/

export type StoneState = "passed" | "here" | "ahead";

const STONE: Record<StoneState, { line: string; cap: string; body: string; text: string; label: string }> = {
  passed: { line: "stroke-ink", cap: "fill-ink", body: "fill-white", text: "fill-ink", label: "Passed" },
  here: { line: "stroke-blue", cap: "fill-blue", body: "fill-blue-wash", text: "fill-blue", label: "Current" },
  ahead: { line: "stroke-rule-2", cap: "fill-white", body: "fill-white", text: "fill-ink-3", label: "Ahead" },
};

export function Stone({ n, state, className }: { n?: number; state: StoneState; className?: string }) {
  const s = STONE[state];
  return (
    <svg viewBox="0 0 28 34" width="28" height="34" className={className} role="img" aria-label={n ? `Milestone ${n}: ${s.label}` : s.label}>
      <path d="M1 33V14h26v19Z" className={s.body} />
      <path d="M1 14a13 13 0 0 1 26 0Z" className={s.cap} />
      <path d="M1 33V14a13 13 0 0 1 26 0v19Z" fill="none" strokeWidth="1.5" strokeLinejoin="round" className={s.line} />
      {n !== undefined && (
        <text x="14" y="27.5" textAnchor="middle" className={`${s.text} font-mono text-[11px] font-medium`}>
          {n}
        </text>
      )}
    </svg>
  );
}

const WHO: Record<"client" | "desk" | "public", Record<Party, string>> = {
  client: { you: "You", easymarg: "EasyMarg", lender: "Lender" },
  desk: { you: "Client", easymarg: "EasyMarg", lender: "Lender" },
  public: { you: "You", easymarg: "EasyMarg", lender: "Lender" },
};

function stateAt(index: number, stage: number): StoneState {
  if (index < stage) return "passed";
  if (index === stage) return "here";
  return "ahead";
}

type RoadProps = {
  milestones: Milestone[];
  /** Index of the current milestone. Pass milestones.length to show the whole road as travelled. */
  stage: number;
  passed?: string[];
  stageSince?: string;
  view?: "client" | "desk" | "public";
};

/** The road laid flat: one column per milestone. Falls back to a list on narrow screens. */
export function RoadStrip({
  milestones,
  stage,
  view = "public",
  detail = false,
  arrive = false,
}: RoadProps & { detail?: boolean; /** Let the stones settle in one after another, in road order. */ arrive?: boolean }) {
  return (
    <ol
      className="grid gap-x-0 gap-y-0 md:[grid-template-columns:repeat(var(--stones),minmax(0,1fr))]"
      style={{ "--stones": milestones.length } as React.CSSProperties}
    >
      {milestones.map((m, i) => {
        const state = stateAt(i, stage);
        const last = i === milestones.length - 1;
        return (
          <li
            key={m.key}
            className={`relative flex gap-4 pb-6 last:pb-0 md:block md:pb-0 md:pr-5 md:last:pr-0 ${arrive ? "settle" : ""}`}
            style={arrive ? { animationDelay: `${300 + i * 110}ms`, animationDuration: "420ms" } : undefined}
          >
            {/* road segment to the next stone */}
            {!last && (
              <>
                <span
                  aria-hidden="true"
                  className={`absolute top-[34px] bottom-0 left-[13px] w-[1.5px] md:hidden ${i < stage ? "bg-ink" : "road-ahead-y"}`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute top-[19px] right-0 left-[28px] hidden h-[1.5px] md:block ${i < stage ? "bg-ink" : "road-ahead-x"}`}
                />
              </>
            )}
            <Stone n={i + 1} state={state} className="relative shrink-0" />
            <div className="min-w-0 md:mt-4">
              <p className={`text-[0.9375rem] leading-snug font-semibold ${state === "ahead" ? "text-ink-2" : "text-ink"}`}>{m.title}</p>
              <p className="t-label mt-1 text-ink-3">{WHO[view][m.who]}</p>
              {detail && (
                <>
                  <p className="mt-3 text-sm leading-relaxed text-ink-2">{m.what}</p>
                  <p className="mt-3 border-t border-rule pt-3 text-sm text-ink">
                    <span className="t-label mb-0.5 block text-ink-3">Paper added</span>
                    {m.paper}
                  </p>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** The road stood up: used on a file, where each milestone carries its date. */
export function RoadColumn({ milestones, stage, passed = [], stageSince, view = "client" }: RoadProps) {
  return (
    <ol>
      {milestones.map((m, i) => {
        const state = stateAt(i, stage);
        const last = i === milestones.length - 1;
        return (
          <li key={m.key} className="relative flex gap-5 pb-8 last:pb-0">
            {!last && (
              <span
                aria-hidden="true"
                className={`absolute top-[34px] bottom-0 left-[13px] w-[1.5px] ${i < stage ? "bg-ink" : "road-ahead-y"}`}
              />
            )}
            <Stone n={i + 1} state={state} className="relative shrink-0" />
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className={`text-base leading-snug font-semibold ${state === "ahead" ? "text-ink-2" : "text-ink"}`}>{m.title}</p>
                <p className="t-data text-ink-3">
                  {state === "passed" && passed[i] && <>Passed {day(passed[i])}</>}
                  {state === "here" && stageSince && <span className="text-blue">Here since {day(stageSince)}</span>}
                </p>
              </div>
              <p className={`mt-1.5 max-w-[52ch] text-sm leading-relaxed ${state === "ahead" ? "text-ink-3" : "text-ink-2"}`}>{m.what}</p>
              <p className="t-label mt-2 text-ink-3">
                Acts: {WHO[view][m.who]} · Paper added: {m.paper}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** The road at a glance: stones only, for a row in a list. */
export function RoadDots({ count, stage }: { count: number; stage: number }) {
  return (
    <span className="inline-flex items-center" role="img" aria-label={`Milestone ${Math.min(stage + 1, count)} of ${count}`}>
      {Array.from({ length: count }, (_, i) => {
        const state = stateAt(i, stage);
        return (
          <span key={i} className="flex items-center">
            <span
              className={`block h-[11px] w-[9px] rounded-t-full border-[1.5px] ${
                state === "passed" ? "border-ink bg-ink" : state === "here" ? "border-blue bg-blue" : "border-rule-2 bg-white"
              }`}
            />
            {i < count - 1 && <span className={`block h-[1.5px] w-3 ${i < stage ? "bg-ink" : "road-ahead-x"}`} />}
          </span>
        );
      })}
    </span>
  );
}
