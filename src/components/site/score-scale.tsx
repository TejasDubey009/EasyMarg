"use client";

import { useId, useState } from "react";

/*
  A ruler from 300 to 900, the range of a CIBIL score.
  Blue marks where you are standing, the same way it marks the current
  milestone on a file.
*/

const MIN = 300;
const MAX = 900;

const BANDS = [
  {
    from: 300,
    to: 549,
    name: "Below 550",
    lenders: "Most lenders decline on the score alone.",
    work: "Repair comes first: dispute the errors, close what is still open, and let some clean months show on the report. We will say this on the first call rather than take on a file that cannot pass.",
  },
  {
    from: 550,
    to: 649,
    name: "550 to 649",
    lenders: "Banks usually decline. Some housing finance companies lend against a strong file.",
    work: "The file has to do what the score cannot: steady income, a co-applicant, a larger contribution of your own, and a written account of what went wrong and when it ended.",
  },
  {
    from: 650,
    to: 749,
    name: "650 to 749",
    lenders: "Borderline. Often approvable with the right lender.",
    work: "Choose the lender with care and explain each past mark before anyone asks. One well-placed submission does more than five hopeful ones.",
  },
  {
    from: 750,
    to: 900,
    name: "750 and above",
    lenders: "Your score is not the problem.",
    work: "If you were declined, the cause is income proof, the property, or an error on the report. We find out which.",
  },
];

const TICKS = [300, 550, 650, 750, 900];
const position = (score: number) => ((score - MIN) / (MAX - MIN)) * 100;

export function ScoreScale() {
  const id = useId();
  const [score, setScore] = useState(620);
  const band = BANDS.find((b) => score >= b.from && score <= b.to) ?? BANDS[0];

  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          Move the marker to your score
        </label>
        <output htmlFor={id} className="font-mono text-[2.5rem] leading-none font-medium text-blue [font-variant-numeric:tabular-nums]">
          {score}
        </output>
      </div>

      <div className="relative mt-5 h-11">
        <div aria-hidden="true" className="absolute inset-x-0 top-1/2 flex h-3 -translate-y-1/2 gap-[3px]">
          {BANDS.map((b) => (
            <span
              key={b.from}
              style={{ width: `${((b.to - b.from + 1) / (MAX - MIN + 1)) * 100}%` }}
              className={`h-full first:rounded-l-xs last:rounded-r-xs ${b === band ? "bg-blue" : "bg-rule"}`}
            />
          ))}
        </div>
        <input
          id={id}
          type="range"
          min={MIN}
          max={MAX}
          step={1}
          value={score}
          onChange={(event) => setScore(Number(event.target.value))}
          aria-valuetext={`${score}: ${band.name}. ${band.lenders}`}
          className="score-range absolute inset-0 h-full w-full"
        />
      </div>

      <div aria-hidden="true" className="relative mt-1 h-5">
        {TICKS.map((tick) => (
          <span
            key={tick}
            style={{ left: `${position(tick)}%` }}
            className={`t-data absolute text-[0.75rem] text-ink-3 ${tick === MIN ? "" : tick === MAX ? "-translate-x-full" : "-translate-x-1/2"}`}
          >
            {tick}
          </span>
        ))}
      </div>

      <div aria-live="polite" className="mt-8 grid gap-x-10 gap-y-5 border-t border-ink pt-5 sm:grid-cols-2">
        <div>
          <p className="t-label text-ink-3">How lenders tend to read {band.name.toLowerCase()}</p>
          <p className="mt-2 text-[1.0625rem] leading-snug font-semibold text-ink">{band.lenders}</p>
        </div>
        <div>
          <p className="t-label text-ink-3">What the work is</p>
          <p className="mt-2 text-ink-2">{band.work}</p>
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-3">
        Indicative only, drawn from common lender practice in India. Each lender sets its own policy, and a score is one input
        among several. Do not know your score? Reading your report with you is the first milestone.
      </p>
    </div>
  );
}
