"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileButton, SelectField, TextArea, type Picked } from "@/components/ui/field";
import { Alert, Download } from "@/components/ui/icons";
import { PaperStamp } from "@/components/ui/stamp";
import { paperRef, type CaseFile, type Doc } from "@/lib/data";
import { day, fileSize } from "@/lib/format";
import { notify } from "@/lib/notify";
import { demo } from "@/lib/store";

const SEND_BACK_REASONS = ["Pages missing", "Scan is unreadable", "PDF is locked", "Wrong document", "Out of date", "Signature missing"];

export function downloadNotice() {
  notify("Demo build: files are not stored, so there is nothing to download yet.");
}

function Meta({ doc, view }: { doc: Doc; view: "client" | "desk" }) {
  if (doc.status === "needed") return <>{doc.accepts ?? "Not filed yet."}</>;
  const by = doc.filedBy === "client" ? (view === "client" ? "you" : "client") : doc.filedBy === "lender" ? "the lender" : "EasyMarg";
  return (
    <>
      <span className="t-data text-[0.75rem]">{doc.filename}</span>
      {doc.sizeKb !== undefined && <> · {fileSize(doc.sizeKb)}</>}
      {doc.filedOn && (
        <>
          {" "}
          · Filed {day(doc.filedOn)} by {by}
        </>
      )}
      {doc.status === "verified" && doc.checkedBy && doc.checkedOn && (
        <>
          {" "}
          · Checked {day(doc.checkedOn)} by {doc.checkedBy}
        </>
      )}
    </>
  );
}

/** One paper in a file: what it is, where it stands, and the one thing you can do with it. */
export function PaperRow({
  doc,
  file,
  view,
  officer,
  showFile = false,
}: {
  doc: Doc;
  file: CaseFile;
  view: "client" | "desk";
  officer?: string;
  showFile?: boolean;
}) {
  const [sendingBack, setSendingBack] = useState(false);
  const [reason, setReason] = useState(SEND_BACK_REASONS[0]);
  const [detail, setDetail] = useState("");

  const upload = (picked: Picked) => {
    demo.filePaper(doc.id, picked);
    notify(`Filed: ${doc.title}. An officer will check it.`);
  };

  return (
    <li className="border-b border-rule py-4">
      <div className="grid grid-cols-[4.25rem_1fr] items-start gap-x-4 gap-y-3 sm:grid-cols-[4.75rem_1fr_auto]">
        <span className="t-data pt-0.5 text-ink-3">{paperRef(file, doc.serial)}</span>
        <div className="min-w-0">
          <p className="font-medium text-ink">{doc.title}</p>
          <p className="mt-0.5 text-sm leading-relaxed text-ink-3">
            {showFile && <span className="t-data mr-2 text-[0.75rem] text-ink-2">{file.no}</span>}
            <Meta doc={doc} view={view} />
          </p>
        </div>
        <div className="col-start-2 flex flex-wrap items-center gap-2.5 sm:col-start-3 sm:justify-end">
          <PaperStamp status={doc.status} view={view} />

          {view === "client" && (doc.status === "needed" || doc.status === "reupload") && (
            // A paper that was sent back is the urgent one, so it alone gets the filled button.
            <FileButton
              label={doc.status === "needed" ? "Upload" : "Upload again"}
              variant={doc.status === "reupload" ? "primary" : "outline"}
              onPick={upload}
            />
          )}

          {(doc.status === "filed" || doc.status === "verified") && (
            <button
              type="button"
              onClick={downloadNotice}
              aria-label={`Download ${doc.title}`}
              className="inline-flex size-9 items-center justify-center rounded-md border border-rule-2 text-ink transition-colors hover:border-ink"
            >
              <Download />
            </button>
          )}

        </div>

        {/* The officer's two verdicts sit under the paper they are about. */}
        {view === "desk" && doc.status === "filed" && officer && (
          <div className="col-start-2 -col-end-1 flex flex-wrap gap-2.5">
            <Button
              size="sm"
              onClick={() => {
                demo.verify(doc.id, officer);
                notify(`Checked: ${doc.title}.`);
              }}
            >
              Mark checked
            </Button>
            <Button size="sm" variant="quiet" aria-expanded={sendingBack} onClick={() => setSendingBack((value) => !value)}>
              Send back
            </Button>
          </div>
        )}
      </div>

      {doc.status === "reupload" && doc.issues && (
        <div className="mt-3 ml-0 overflow-hidden rounded-sm border border-stop/25 sm:ml-[5.75rem]">
          <p className="flex items-start gap-2.5 bg-stop-wash px-3.5 py-2.5 text-sm text-ink">
            <Alert className="mt-0.5 shrink-0 text-stop" />
            {view === "client"
              ? `This paper was sent back. ${doc.issues.length === 1 ? "One thing" : `${doc.issues.length} things`} to fix before you upload it again.`
              : `Sent back to the client with ${doc.issues.length === 1 ? "one issue" : `${doc.issues.length} issues`}.`}
          </p>
          <dl>
            {doc.issues.map((issue) => (
              <div key={issue.label} className="grid gap-x-4 gap-y-0.5 border-t border-stop/15 px-3.5 py-2.5 text-sm sm:grid-cols-[9rem_1fr]">
                <dt className="font-medium text-ink">{issue.label}</dt>
                <dd className="text-ink-2">{issue.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {view === "desk" && sendingBack && officer && (
        <form
          className="mt-4 space-y-4 rounded-sm border border-rule-2 bg-paper p-4 sm:ml-[5.75rem]"
          onSubmit={(event) => {
            event.preventDefault();
            if (!detail.trim()) return;
            demo.sendBack(doc.id, { label: reason, detail: detail.trim() }, officer);
            notify(`Sent back: ${doc.title}. The client has been told why.`);
            setSendingBack(false);
            setDetail("");
          }}
        >
          <SelectField label="What is wrong" value={reason} onChange={(event) => setReason(event.target.value)}>
            {SEND_BACK_REASONS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </SelectField>
          <TextArea
            label="What the client should do"
            hint="They read this exactly as written. Say what to fix and how."
            required
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
          />
          <div className="flex gap-2.5">
            <Button type="submit" size="sm">
              Send back to client
            </Button>
            <Button size="sm" variant="quiet" onClick={() => setSendingBack(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </li>
  );
}
