"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Activity, Block, Missing } from "@/components/app/file-parts";
import { PaperRow } from "@/components/app/paper-row";
import { useMine } from "@/components/app/use-records";
import { RoadColumn } from "@/components/road";
import { ArrowLeft } from "@/components/ui/icons";
import { Facts } from "@/components/ui/layout";
import { WaitingStamp } from "@/components/ui/stamp";
import { KIND_LABEL, ROAD, type DocStatus } from "@/lib/data";
import { day, inr } from "@/lib/format";

/* Papers that need you come first, then the ones being checked, then the ones that are done. */
const ORDER: Record<DocStatus, number> = { reupload: 0, needed: 1, filed: 2, verified: 3 };

export default function FilePage() {
  const { id } = useParams<{ id: string }>();
  const { files, docs } = useMine();
  const file = files.find((f) => f.id === id);

  if (!file) return <Missing back="/portal" label="Back to your files" />;

  const road = ROAD[file.kind];
  const done = file.stage >= road.length;
  const papers = docs.filter((d) => d.fileId === file.id).sort((a, b) => ORDER[a.status] - ORDER[b.status] || a.serial - b.serial);
  const open = papers.filter((d) => d.status === "needed" || d.status === "reupload").length;

  return (
    <div>
      <Link href="/portal" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 underline-offset-4 hover:text-ink hover:underline">
        <ArrowLeft />
        Your files
      </Link>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <div>
          <p className="flex flex-wrap items-center gap-3">
            <span className="t-label text-ink-3">File no.</span>
            <span className="t-data font-medium text-ink">{file.no}</span>
            <WaitingStamp party={file.waitingOn} />
          </p>
          <h1 className="t-h1 mt-3">
            {KIND_LABEL[file.kind]}, <span className="[font-variant-numeric:tabular-nums]">{inr(file.amount)}</span>
          </h1>
          <p className="mt-2 text-ink-2">{file.subject}</p>
        </div>
        <dl className="flex gap-10 text-sm">
          <div>
            <dt className="t-label text-ink-3">Opened</dt>
            <dd className="t-data mt-1 text-ink">{day(file.openedOn)}</dd>
          </div>
          <div>
            <dt className="t-label text-ink-3">Case officer</dt>
            <dd className="mt-1 text-ink">{file.officer}</dd>
          </div>
        </dl>
      </header>

      {/* The one line that answers "what is happening with my file?" */}
      <div
        className={`mt-8 grid gap-x-6 gap-y-2 rounded-sm border px-5 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center ${
          file.waitingOn === "you" ? "border-blue/30 bg-blue-wash" : "border-rule-2 bg-paper"
        }`}
      >
        <p className="t-label text-ink-2">{done ? "Status" : `Milestone ${file.stage + 1} of ${road.length}`}</p>
        <p className="text-ink">
          <span className="font-semibold">{done ? "Road complete." : `${road[file.stage].title}.`}</span> {file.waitingFor}
        </p>
        {open > 0 && (
          <a href="#papers" className="text-sm font-medium text-blue underline decoration-blue/30 underline-offset-4 hover:decoration-blue">
            {open} {open === 1 ? "paper" : "papers"} to upload
          </a>
        )}
      </div>

      <div className="mt-12 grid gap-x-12 gap-y-14 lg:grid-cols-12">
        <div className="space-y-14 lg:col-span-7">
          <Block id="road" title="The road">
            <div className="pt-7">
              <RoadColumn milestones={road} stage={file.stage} passed={file.passed} stageSince={file.stageSince} view="client" />
            </div>
          </Block>

          <Block
            id="papers"
            title="Papers in this file"
            aside={
              <p className="t-data text-ink-3">
                {papers.filter((d) => d.status !== "needed").length} on record
              </p>
            }
          >
            <ul>
              {papers.map((doc) => (
                <PaperRow key={doc.id} doc={doc} file={file} view="client" />
              ))}
            </ul>
          </Block>
        </div>

        <div className="space-y-14 lg:col-span-5">
          <Block id="facts" title="What the file says">
            <Facts rows={file.facts} className="border-t-0" />
          </Block>

          <Block id="diary" title="Diary">
            <Activity file={file} />
          </Block>
        </div>
      </div>
    </div>
  );
}
