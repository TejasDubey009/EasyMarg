"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Activity, Block, Missing } from "@/components/app/file-parts";
import { PaperRow } from "@/components/app/paper-row";
import { useOfficer } from "@/components/app/use-records";
import { RoadColumn } from "@/components/road";
import { Button } from "@/components/ui/button";
import { DropZone, TextArea, TextField, type Picked } from "@/components/ui/field";
import { ArrowLeft } from "@/components/ui/icons";
import { Facts } from "@/components/ui/layout";
import { WaitingStamp } from "@/components/ui/stamp";
import { KIND_LABEL, ROAD, type DocStatus } from "@/lib/data";
import { day, inr } from "@/lib/format";
import { notify } from "@/lib/notify";
import { demo, useDemo } from "@/lib/store";

/* What the desk has to act on comes first. */
const ORDER: Record<DocStatus, number> = { filed: 0, reupload: 1, needed: 2, verified: 3 };

export default function DeskFilePage() {
  const { id } = useParams<{ id: string }>();
  const officer = useOfficer();
  const { files, docs, clients } = useDemo();
  const file = files.find((f) => f.id === id);

  const [confirming, setConfirming] = useState(false);
  const [note, setNote] = useState("");
  const [issuing, setIssuing] = useState(false);
  const [title, setTitle] = useState("");
  const [picked, setPicked] = useState<Picked | null>(null);

  if (!file) return <Missing back="/desk" label="Back to the queue" />;

  const client = clients.find((c) => c.id === file.clientId);
  const road = ROAD[file.kind];
  const done = file.stage >= road.length;
  const papers = docs.filter((d) => d.fileId === file.id).sort((a, b) => ORDER[a.status] - ORDER[b.status] || a.serial - b.serial);
  const toCheck = papers.filter((d) => d.status === "filed").length;
  const outstanding = papers.filter((d) => d.status === "needed" || d.status === "reupload").length;

  return (
    <div>
      <Link href="/desk" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 underline-offset-4 hover:text-ink hover:underline">
        <ArrowLeft />
        Queue
      </Link>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <div>
          <p className="flex flex-wrap items-center gap-3">
            <span className="t-label text-ink-3">File no.</span>
            <span className="t-data font-medium text-ink">{file.no}</span>
            <WaitingStamp party={file.waitingOn} view="desk" />
          </p>
          <h1 className="t-h1 mt-3">{client?.name}</h1>
          <p className="mt-2 text-ink-2">
            {KIND_LABEL[file.kind]}, <span className="[font-variant-numeric:tabular-nums]">{inr(file.amount)}</span> · {file.subject}
          </p>
        </div>
        <dl className="flex gap-10 text-sm">
          <div>
            <dt className="t-label text-ink-3">Opened</dt>
            <dd className="t-data mt-1 text-ink">{day(file.openedOn)}</dd>
          </div>
          <div>
            <dt className="t-label text-ink-3">Officer</dt>
            <dd className="mt-1 text-ink">{file.officer}</dd>
          </div>
          <div>
            <dt className="t-label text-ink-3">To check</dt>
            <dd className={`t-data mt-1 ${toCheck ? "font-medium text-blue" : "text-ink"}`}>{toCheck}</dd>
          </div>
        </dl>
      </header>

      <div className="mt-12 grid gap-x-12 gap-y-14 lg:grid-cols-12">
        <div className="space-y-14 lg:col-span-7">
          <Block
            id="papers"
            title="Papers"
            aside={
              <Button size="sm" variant="quiet" aria-expanded={issuing} onClick={() => setIssuing((value) => !value)}>
                {issuing ? "Close" : "File a paper for the client"}
              </Button>
            }
          >
            {issuing && (
              <form
                className="mt-5 space-y-4 rounded-sm border border-rule-2 bg-paper p-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!title.trim() || !picked) return;
                  demo.addPaper(file.id, { title: title.trim(), group: "Issued", ...picked }, "easymarg", officer);
                  notify(`Filed: ${title.trim()}. The client can see it now.`);
                  setTitle("");
                  setPicked(null);
                  setIssuing(false);
                }}
              >
                <TextField
                  label="Name of the paper"
                  hint="Something EasyMarg or the lender has issued: a sanction letter, a query, a note."
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Sanction letter"
                />
                <DropZone picked={picked} onPick={setPicked} />
                <Button type="submit" size="sm" disabled={!title.trim() || !picked}>
                  Put on the client&rsquo;s record
                </Button>
              </form>
            )}
            <ul>
              {papers.map((doc) => (
                <PaperRow key={doc.id} doc={doc} file={file} view="desk" officer={officer} />
              ))}
            </ul>
          </Block>

          <Block id="diary" title="Diary">
            <form
              className="border-b border-rule py-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (!note.trim()) return;
                demo.note(file.id, note.trim(), officer);
                setNote("");
              }}
            >
              <TextArea
                label="Add an entry"
                hint="The client reads the diary. Write it for them."
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="min-h-20"
              />
              <Button type="submit" size="sm" variant="outline" className="mt-3" disabled={!note.trim()}>
                Add to diary
              </Button>
            </form>
            <Activity file={file} />
          </Block>
        </div>

        <div className="space-y-14 lg:col-span-5">
          <Block id="road" title="The road">
            <div className="pt-7">
              <RoadColumn milestones={road} stage={file.stage} passed={file.passed} stageSince={file.stageSince} view="desk" />
            </div>

            {!done && (
              <div className="mt-8 rounded-sm border border-rule-2 p-4">
                {!confirming ? (
                  <>
                    <p className="text-sm leading-relaxed text-ink-2">
                      Pass a milestone only when its paper is on record.
                      {outstanding + toCheck > 0 && (
                        <>
                          {" "}
                          This file still has {outstanding} {outstanding === 1 ? "paper" : "papers"} outstanding and {toCheck} to check.
                        </>
                      )}
                    </p>
                    <Button className="mt-3" onClick={() => setConfirming(true)}>
                      Pass “{road[file.stage].title}”
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed text-ink">
                      Pass <span className="font-semibold">{road[file.stage].title}</span>
                      {road[file.stage + 1] ? (
                        <>
                          {" "}
                          and move this file to <span className="font-semibold">{road[file.stage + 1].title}</span>?
                        </>
                      ) : (
                        <> and complete the road?</>
                      )}{" "}
                      The client sees the change at once.
                    </p>
                    <div className="mt-3 flex gap-2.5">
                      <Button
                        size="sm"
                        onClick={() => {
                          const passed = road[file.stage].title;
                          demo.advance(file.id, officer);
                          notify(`Passed: ${passed}.`);
                          setConfirming(false);
                        }}
                      >
                        Yes, pass it
                      </Button>
                      <Button size="sm" variant="quiet" onClick={() => setConfirming(false)}>
                        Not yet
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </Block>

          <Block id="facts" title="What the file says">
            <Facts rows={file.facts} className="border-t-0" />
          </Block>
        </div>
      </div>
    </div>
  );
}
