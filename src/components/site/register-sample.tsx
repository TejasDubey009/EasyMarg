"use client";

import { useId, useState } from "react";
import { PaperStamp } from "@/components/ui/stamp";
import { paperRef, SEED } from "@/lib/data";
import { day } from "@/lib/format";

const OPENED = 2026;
const SPAN = 30;

/*
  Six lines from the sample file's register, exactly as the record room lists
  them, with a scrubber that moves the year forward. Nothing in the register
  changes when you drag it. That is the point.
*/
export function RegisterSample() {
  const id = useId();
  const [later, setLater] = useState(0);
  const file = SEED.files[0];
  const rows = SEED.docs.filter((doc) => doc.fileId === file.id && [1, 3, 6, 8, 10, 12].includes(doc.serial));
  const year = OPENED + later;

  return (
    <div>
      <div className="rounded-sm border border-rule-2 bg-white">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule px-5 py-3.5">
          <p className="text-sm font-semibold">
            Register of papers <span className="font-normal text-ink-3">·</span> <span className="font-normal text-ink-2">as it stands in {year}</span>
          </p>
          <p className="t-data text-ink-3">{file.no}</p>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="t-label border-b border-ink text-ink-3">
              <th scope="col" className="py-2.5 pr-3 pl-5 font-normal">
                Ref
              </th>
              <th scope="col" className="py-2.5 pr-3 font-normal">
                Paper
              </th>
              <th scope="col" className="hidden py-2.5 pr-3 font-normal sm:table-cell">
                Filed
              </th>
              <th scope="col" className="hidden py-2.5 pr-3 font-normal md:table-cell">
                Status
              </th>
              <th scope="col" className="py-2.5 pr-5 text-right font-normal">
                Kept
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((doc) => (
              <tr key={doc.id} className="border-b border-rule transition-colors duration-150 last:border-b-0 hover:bg-paper">
                <td className="t-data py-3 pr-3 pl-5 align-top text-ink-3">{paperRef(file, doc.serial)}</td>
                <td className="py-3 pr-3 align-top text-ink">{doc.title}</td>
                <td className="t-data hidden py-3 pr-3 align-top whitespace-nowrap text-ink-2 sm:table-cell">{doc.filedOn && day(doc.filedOn)}</td>
                <td className="hidden py-3 pr-3 align-top md:table-cell">
                  <PaperStamp status={doc.status} />
                </td>
                <td className={`py-3 pr-5 text-right align-top whitespace-nowrap ${later ? "t-data text-blue" : "text-ink"}`}>
                  {later ? `${later} ${later === 1 ? "yr" : "yrs"}, still here` : "For life"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-x-8 gap-y-1 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label htmlFor={id} className="text-sm font-medium text-ink">
            Open this record in a later year
          </label>
          <input
            id={id}
            type="range"
            min={0}
            max={SPAN}
            step={1}
            value={later}
            onChange={(event) => setLater(Number(event.target.value))}
            aria-valuetext={`${year}`}
            className="line-range block w-full"
          />
          <div aria-hidden="true" className="t-data -mt-1 flex justify-between text-[0.75rem] text-ink-3">
            <span>{OPENED}</span>
            <span>{OPENED + SPAN / 3}</span>
            <span>{OPENED + (SPAN * 2) / 3}</span>
            <span>{OPENED + SPAN}</span>
          </div>
        </div>
        <p aria-live="polite" className="min-w-[13rem] text-sm text-ink-2 sm:text-right">
          <span className="block font-mono text-[2rem] leading-none font-medium text-blue [font-variant-numeric:tabular-nums]">{year}</span>
          <span className="mt-1.5 block">{later ? "Same papers. Same numbers." : "The year the file was opened."}</span>
        </p>
      </div>
    </div>
  );
}
