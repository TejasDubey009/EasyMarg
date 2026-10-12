"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useOfficer } from "@/components/app/use-records";
import { RoadDots } from "@/components/road";
import { Search } from "@/components/ui/icons";
import { WaitingStamp } from "@/components/ui/stamp";
import { KIND_LABEL, ROAD, type Party } from "@/lib/data";
import { daysSince, inrWords, today } from "@/lib/format";
import { useDemo } from "@/lib/store";

type With = "all" | Party;

const TABS: { value: With; label: string }[] = [
  { value: "all", label: "All open" },
  { value: "easymarg", label: "With us" },
  { value: "you", label: "With client" },
  { value: "lender", label: "With lender" },
];

export default function QueuePage() {
  const officer = useOfficer();
  const { files, docs, clients } = useDemo();
  const [tab, setTab] = useState<With>("all");
  const [mine, setMine] = useState(false);
  const [query, setQuery] = useState("");
  const now = today();

  const open = useMemo(() => files.filter((f) => f.stage < ROAD[f.kind].length), [files]);
  const toCheck = (fileId: string) => docs.filter((d) => d.fileId === fileId && d.status === "filed").length;
  const clientOf = (id: string) => clients.find((c) => c.id === id);
  const count = (party: With) => (party === "all" ? open.length : open.filter((f) => f.waitingOn === party).length);
  const allToCheck = open.reduce((total, f) => total + toCheck(f.id), 0);

  const rows = open
    .filter((f) => tab === "all" || f.waitingOn === tab)
    .filter((f) => !mine || f.officer === officer)
    .filter((f) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return f.no.toLowerCase().includes(q) || (clientOf(f.clientId)?.name ?? "").toLowerCase().includes(q) || f.subject.toLowerCase().includes(q);
    })
    // Whatever needs the desk comes first, then whatever has sat longest.
    .sort((a, b) => toCheck(b.id) - toCheck(a.id) || (a.stageSince < b.stageSince ? -1 : 1));

  return (
    <div>
      <header>
        <p className="t-label text-ink-3">{officer}</p>
        <h1 className="t-h1 mt-3">Queue</h1>
        <p className="mt-3 text-ink-2">
          {open.length} open files. {count("easymarg")} with us. {allToCheck} {allToCheck === 1 ? "paper" : "papers"} to check.
        </p>
      </header>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <div role="group" aria-label="Who the file is with" className="flex flex-wrap gap-1.5">
          {TABS.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={tab === item.value}
              onClick={() => setTab(item.value)}
              className={`inline-flex h-8 items-center gap-2 rounded-sm border px-3 text-sm font-medium transition-colors ${
                tab === item.value ? "border-ink bg-ink text-white" : "border-rule-2 bg-white text-ink-2 hover:border-ink hover:text-ink"
              }`}
            >
              {item.label}
              <span className={`t-data text-[0.75rem] ${tab === item.value ? "text-white/70" : "text-ink-3"}`}>{count(item.value)}</span>
            </button>
          ))}
        </div>
        <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={mine} onChange={(event) => setMine(event.target.checked)} className="size-4 accent-blue" />
            My files only
          </label>
          <label className="relative block flex-1 sm:w-72 sm:flex-none">
            <span className="sr-only">Search the queue</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-3" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="File no., client or property"
              className="h-10 w-full rounded-sm border border-rule-2 bg-white pr-3 pl-9 text-sm text-ink placeholder:text-ink-3 hover:border-ink-3 focus:border-blue focus:ring-3 focus:ring-blue/15 focus:outline-none"
            />
          </label>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[46rem] text-left text-sm">
          <thead>
            <tr className="t-label border-b border-ink text-ink-3">
              <th scope="col" className="py-2.5 pr-4 font-normal">
                File
              </th>
              <th scope="col" className="py-2.5 pr-4 font-normal">
                Client
              </th>
              <th scope="col" className="py-2.5 pr-4 text-right font-normal">
                Amount
              </th>
              <th scope="col" className="py-2.5 pr-4 pl-4 font-normal">
                Milestone
              </th>
              <th scope="col" className="py-2.5 pr-4 font-normal">
                With
              </th>
              <th scope="col" className="py-2.5 pr-4 text-right font-normal">
                Days here
              </th>
              <th scope="col" className="py-2.5 text-right font-normal">
                To check
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((file) => {
              const road = ROAD[file.kind];
              const client = clientOf(file.clientId);
              const waiting = toCheck(file.id);
              return (
                <tr key={file.id} className="border-b border-rule align-top transition-colors hover:bg-paper">
                  <td className="py-3.5 pr-4">
                    <Link href={`/desk/files/${file.id}`} className="t-data font-medium text-blue underline decoration-blue/30 underline-offset-4 hover:decoration-blue">
                      {file.no}
                    </Link>
                    <span className="mt-0.5 block text-[0.8125rem] text-ink-3">{KIND_LABEL[file.kind]}</span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="font-medium text-ink">{client?.name}</span>
                    <span className="mt-0.5 block text-[0.8125rem] text-ink-3">
                      {client?.city} · {file.officer}
                    </span>
                  </td>
                  <td className="t-data py-3.5 pr-4 text-right whitespace-nowrap text-ink">{inrWords(file.amount)}</td>
                  <td className="py-3.5 pr-4 pl-4">
                    <RoadDots count={road.length} stage={file.stage} />
                    <span className="mt-1 block whitespace-nowrap text-ink">{road[file.stage].title}</span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <WaitingStamp party={file.waitingOn} view="desk" />
                  </td>
                  <td className="t-data py-3.5 pr-4 text-right text-ink">{daysSince(file.stageSince, now)}</td>
                  <td className={`t-data py-3.5 text-right ${waiting ? "font-medium text-blue" : "text-ink-3"}`}>{waiting || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <p className="border-b border-rule py-10 text-center text-ink-2">No open file matches that.</p>}
      </div>
    </div>
  );
}
