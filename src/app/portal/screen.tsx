"use client";

import Link from "next/link";
import { PaperRow } from "@/components/app/paper-row";
import { Register } from "@/components/app/register";
import { useMine } from "@/components/app/use-records";
import { RoadDots } from "@/components/road";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";
import { WaitingStamp } from "@/components/ui/stamp";
import { KIND_LABEL, ROAD, type CaseFile } from "@/lib/data";
import { day, inr } from "@/lib/format";

function headline(files: CaseFile[]): string {
  if (files.length === 0) return "You have no files yet.";
  const onYou = files.filter((f) => f.waitingOn === "you").length;
  if (files.length === 1) {
    const [file] = files;
    if (file.stage >= ROAD[file.kind].length) return "Your file has reached the end of the road.";
    if (file.waitingOn === "you") return "Your file is waiting on you.";
    if (file.waitingOn === "lender") return "Your file is with the lender.";
    return "Your file is with EasyMarg.";
  }
  return onYou > 0 ? `${onYou} of your ${files.length} files ${onYou === 1 ? "is" : "are"} waiting on you.` : `Your ${files.length} files are moving. Nothing is waiting on you.`;
}

export default function OverviewPage() {
  const { client, files, docs } = useMine();
  const fileOf = (id: string) => files.find((f) => f.id === id)!;

  const todo = docs.filter((d) => d.status === "reupload" || d.status === "needed").sort((a, b) => (a.status === b.status ? 0 : a.status === "reupload" ? -1 : 1));
  const latest = docs
    .filter((d) => d.filedOn)
    .sort((a, b) => (b.filedOn! > a.filedOn! ? 1 : b.filedOn! < a.filedOn! ? -1 : b.serial - a.serial))
    .slice(0, 4);
  const onRecord = docs.filter((d) => d.status !== "needed").length;

  return (
    <div className="grid gap-x-12 gap-y-12 lg:grid-cols-12">
      <header className="lg:col-span-12">
        <p className="t-label text-ink-3">{client?.name}</p>
        <h1 className="t-h1 mt-3 max-w-[22ch]">{headline(files)}</h1>
      </header>

      <div className="space-y-14 lg:col-span-8">
        <section aria-labelledby="todo">
          <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
            <h2 id="todo" className="t-h3">
              Waiting on you
            </h2>
            <p className="t-data text-ink-3">
              {todo.length} {todo.length === 1 ? "paper" : "papers"}
            </p>
          </div>
          {todo.length > 0 ? (
            <ul>
              {todo.map((doc) => (
                <PaperRow key={doc.id} doc={doc} file={fileOf(doc.fileId)} view="client" showFile={files.length > 1} />
              ))}
            </ul>
          ) : (
            <p className="border-b border-rule py-8 text-ink-2">
              Nothing is waiting on you. When a lender or your case officer needs a paper, it appears here first.
            </p>
          )}
        </section>

        <section aria-labelledby="files">
          <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
            <h2 id="files" className="t-h3">
              Your files
            </h2>
            <TextLink href="/portal/apply" className="text-sm">
              Start another
            </TextLink>
          </div>
          {files.length > 0 ? (
            <ul>
              {files.map((file) => {
                const road = ROAD[file.kind];
                const done = file.stage >= road.length;
                return (
                  <li key={file.id} className="border-b border-rule">
                    <Link href={`/portal/files/${file.id}`} className="group grid gap-x-6 gap-y-3 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          <span className="t-data text-ink-3">{file.no}</span>
                          <WaitingStamp party={file.waitingOn} />
                        </p>
                        <p className="mt-2 text-[1.0625rem] font-semibold text-ink underline-offset-4 group-hover:underline">
                          {KIND_LABEL[file.kind]} <span className="font-normal text-ink-3">·</span>{" "}
                          <span className="[font-variant-numeric:tabular-nums]">{inr(file.amount)}</span>
                        </p>
                        <p className="mt-0.5 text-sm text-ink-2">{file.subject}</p>
                      </div>
                      <div className="flex items-center gap-5 sm:justify-end">
                        <div className="sm:text-right">
                          <RoadDots count={road.length} stage={file.stage} />
                          <p className="mt-1.5 text-sm text-ink">
                            {done ? "Road complete" : road[file.stage].title}
                            <span className="t-data ml-2 text-[0.75rem] text-ink-3">since {day(file.stageSince)}</span>
                          </p>
                        </div>
                        <ArrowRight className="shrink-0 text-ink-3 transition-transform duration-150 group-hover:translate-x-1 group-hover:text-ink" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="border-b border-rule py-8">
              <p className="max-w-[52ch] text-ink-2">A file is one application: a home loan, or a treasury mandate. It holds your milestones and every paper that goes with them.</p>
              <ButtonLink href="/portal/apply" className="mt-5">
                Start an application
              </ButtonLink>
            </div>
          )}
        </section>

        <section aria-labelledby="latest">
          <div className="flex items-baseline justify-between gap-4 pb-1">
            <h2 id="latest" className="t-h3">
              Latest on record
            </h2>
            <TextLink href="/portal/documents" className="text-sm">
              Open the record room
              <ArrowRight />
            </TextLink>
          </div>
          <div className="mt-2">
            <Register view="client" lines={latest.map((doc) => ({ doc, file: fileOf(doc.fileId) }))} empty="Papers you file will be listed here." />
          </div>
        </section>
      </div>

      <aside className="space-y-10 lg:col-span-4">
        {files[0] && (
          <section aria-labelledby="officer" className="border-t border-ink pt-4">
            <h2 id="officer" className="t-label text-ink-3">
              Your case officer
            </h2>
            <p className="mt-3 text-[1.0625rem] font-semibold">{files[0].officer}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">Reads every paper on your file and speaks to the lender for you.</p>
            <a href="mailto:support@easymarg.com" className="mt-4 inline-block text-sm font-medium text-blue underline decoration-blue/30 underline-offset-4 hover:decoration-blue">
              support@easymarg.com
            </a>
          </section>
        )}

        <section aria-labelledby="record" className="border-t border-ink pt-4">
          <h2 id="record" className="t-label text-ink-3">
            Record room
          </h2>
          <p className="mt-3 font-mono text-[2rem] leading-none font-medium [font-variant-numeric:tabular-nums]">{onRecord}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            {onRecord === 1 ? "paper" : "papers"} on record across {files.length} {files.length === 1 ? "file" : "files"}. Kept for life.
          </p>
        </section>

        <p className="border-t border-rule pt-4 text-sm leading-relaxed text-ink-3">
          No EasyMarg officer will ever ask for your OTP, PIN or net-banking password.
        </p>
      </aside>
    </div>
  );
}
