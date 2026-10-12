"use client";

import type { CaseFile } from "@/lib/data";
import { day } from "@/lib/format";

/** A ruled block with a heading and an optional count or action on the right. */
export function Block({
  id,
  title,
  aside,
  children,
}: {
  id: string;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id}>
      <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
        <h2 id={id} className="t-h3">
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

/** The file's diary: who did what, newest first. */
export function Activity({ file }: { file: CaseFile }) {
  return (
    <ol>
      {file.activity.map((entry, i) => (
        <li key={`${entry.on}-${i}`} className="grid grid-cols-[5.75rem_1fr] gap-x-4 border-b border-rule py-3 text-sm">
          <time dateTime={entry.on} className="t-data pt-px text-ink-3">
            {day(entry.on)}
          </time>
          <p className="min-w-0 text-ink">
            {entry.text}
            <span className="block text-[0.8125rem] text-ink-3">{entry.by}</span>
          </p>
        </li>
      ))}
    </ol>
  );
}

export function Missing({ back, label }: { back: string; label: string }) {
  return (
    <div className="py-16">
      <h1 className="t-h2">That file is not on your record.</h1>
      <p className="mt-3 max-w-[52ch] text-ink-2">The link may be old, or the file belongs to a different account.</p>
      <a href={back} className="mt-6 inline-block font-medium text-blue underline underline-offset-4">
        {label}
      </a>
    </div>
  );
}
