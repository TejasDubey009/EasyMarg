"use client";

import { Download } from "@/components/ui/icons";
import { PaperStamp } from "@/components/ui/stamp";
import { paperRef, type CaseFile, type Doc } from "@/lib/data";
import { day } from "@/lib/format";
import { downloadNotice } from "./paper-row";

export type RegisterLine = { doc: Doc; file: CaseFile; client?: string };

/** The register: every paper on record, one line each. */
export function Register({ lines, view, empty }: { lines: RegisterLine[]; view: "client" | "desk"; empty: string }) {
  if (lines.length === 0) {
    return <p className="border-y border-rule py-10 text-center text-ink-2">{empty}</p>;
  }

  const filedBy = (doc: Doc) => (doc.filedBy === "client" ? (view === "client" ? "You" : "Client") : doc.filedBy === "lender" ? "Lender" : "EasyMarg");

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="t-label border-b border-ink text-ink-3">
          <th scope="col" className="w-[5.5rem] py-2.5 pr-3 font-normal">
            Ref
          </th>
          <th scope="col" className="py-2.5 pr-3 font-normal">
            Paper
          </th>
          {view === "desk" && (
            <th scope="col" className="hidden py-2.5 pr-3 font-normal lg:table-cell">
              Client
            </th>
          )}
          <th scope="col" className="hidden py-2.5 pr-3 font-normal lg:table-cell">
            Kind
          </th>
          <th scope="col" className="hidden py-2.5 pr-3 font-normal md:table-cell">
            Filed
          </th>
          <th scope="col" className="hidden py-2.5 pr-3 font-normal sm:table-cell">
            Status
          </th>
          <th scope="col" className="hidden py-2.5 pr-3 font-normal md:table-cell">
            Kept
          </th>
          <th scope="col" aria-label="Download" className="w-9 py-2.5" />
        </tr>
      </thead>
      <tbody>
        {lines.map(({ doc, file, client }) => (
          <tr key={doc.id} className="border-b border-rule align-top">
            <td className="t-data py-3.5 pr-3 text-ink-3">{paperRef(file, doc.serial)}</td>
            <td className="py-3.5 pr-3">
              <p className="font-medium text-ink">{doc.title}</p>
              <p className="t-data mt-0.5 text-[0.75rem] break-all text-ink-3">{doc.filename}</p>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-3 md:hidden">
                <span className="sm:hidden">
                  <PaperStamp status={doc.status} view={view} />
                </span>
                {doc.filedOn && <span className="t-data text-[0.75rem]">{day(doc.filedOn)}</span>}
                {client && <span className="lg:hidden">{client}</span>}
              </p>
            </td>
            {view === "desk" && <td className="hidden py-3.5 pr-3 text-ink-2 lg:table-cell">{client}</td>}
            <td className="hidden py-3.5 pr-3 text-ink-2 lg:table-cell">{doc.group}</td>
            <td className="hidden py-3.5 pr-3 whitespace-nowrap md:table-cell">
              <span className="t-data text-ink">{doc.filedOn && day(doc.filedOn)}</span>
              <span className="block text-[0.8125rem] text-ink-3">{filedBy(doc)}</span>
            </td>
            <td className="hidden py-3.5 pr-3 sm:table-cell">
              <PaperStamp status={doc.status} view={view} />
            </td>
            <td className="hidden py-3.5 pr-3 whitespace-nowrap text-ink md:table-cell">For life</td>
            <td className="py-2.5">
              <button
                type="button"
                onClick={downloadNotice}
                aria-label={`Download ${doc.title}`}
                className="inline-flex size-9 items-center justify-center rounded-md border border-transparent text-ink-2 transition-colors hover:border-rule-2 hover:text-ink"
              >
                <Download />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
