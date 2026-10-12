"use client";

import { useMemo, useState } from "react";
import { Register } from "@/components/app/register";
import { useMine } from "@/components/app/use-records";
import { Button } from "@/components/ui/button";
import { DropZone, SelectField, TextField, type Picked } from "@/components/ui/field";
import { Search } from "@/components/ui/icons";
import { DOC_GROUPS, type DocGroup } from "@/lib/data";
import { notify } from "@/lib/notify";
import { demo } from "@/lib/store";

type Filter = "All" | DocGroup;

export default function RecordRoomPage() {
  const { files, docs } = useMine();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<Filter>("All");
  const [adding, setAdding] = useState(false);

  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<DocGroup>("Identity");
  const [fileId, setFileId] = useState("");
  const [picked, setPicked] = useState<Picked | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onRecord = useMemo(
    () =>
      docs
        .filter((d) => d.status !== "needed")
        .sort((a, b) => (b.filedOn! > a.filedOn! ? 1 : b.filedOn! < a.filedOn! ? -1 : b.serial - a.serial)),
    [docs],
  );

  const groups = useMemo(() => DOC_GROUPS.filter((g) => onRecord.some((d) => d.group === g)), [onRecord]);

  const lines = onRecord
    .filter((d) => group === "All" || d.group === group)
    .filter((d) => {
      const q = query.trim().toLowerCase();
      return !q || d.title.toLowerCase().includes(q) || (d.filename ?? "").toLowerCase().includes(q);
    })
    .map((doc) => ({ doc, file: files.find((f) => f.id === doc.fileId)! }));

  const target = fileId || files[0]?.id || "";

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return setError("Give the paper a name, like “Rent agreement, 2026”.");
    if (!picked) return setError("Choose the file to put on record.");
    demo.addPaper(target, { title: title.trim(), group: kind, ...picked }, "client");
    notify(`Filed: ${title.trim()}. It is on your record now.`);
    setTitle("");
    setPicked(null);
    setError(null);
    setAdding(false);
  };

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <div>
          <p className="t-label text-ink-3">Kept for life</p>
          <h1 className="t-h1 mt-3">Record room</h1>
          <p className="mt-3 max-w-[56ch] text-ink-2">
            {onRecord.length} {onRecord.length === 1 ? "paper" : "papers"} on record across {files.length} {files.length === 1 ? "file" : "files"}. Nothing here
            is deleted when a file closes.
          </p>
        </div>
        {files.length > 0 && (
          <Button variant={adding ? "quiet" : "primary"} aria-expanded={adding} onClick={() => setAdding((value) => !value)}>
            {adding ? "Close" : "File a paper"}
          </Button>
        )}
      </header>

      {adding && (
        <form onSubmit={submit} noValidate className="mt-8 grid gap-5 rounded-sm border border-rule-2 p-5 sm:grid-cols-2 sm:p-6">
          <div className="sm:col-span-2">
            <h2 className="t-h3">Put a paper on record</h2>
            <p className="mt-1 text-sm text-ink-2">For anything nobody has asked for yet but you want kept: a rent agreement, an old sanction letter, a receipt.</p>
          </div>
          <TextField label="What is this paper?" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Rent agreement, 2026" />
          <SelectField label="Kind" value={kind} onChange={(event) => setKind(event.target.value as DocGroup)}>
            {DOC_GROUPS.filter((g) => g !== "Issued").map((g) => (
              <option key={g}>{g}</option>
            ))}
          </SelectField>
          {files.length > 1 && (
            <div className="sm:col-span-2">
              <SelectField label="File it under" value={target} onChange={(event) => setFileId(event.target.value)}>
                {files.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.no} · {f.subject}
                  </option>
                ))}
              </SelectField>
            </div>
          )}
          <div className="sm:col-span-2">
            <DropZone picked={picked} onPick={setPicked} />
            {error && (
              <p role="alert" className="mt-2 text-sm text-stop">
                {error}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">Put on record</Button>
          </div>
        </form>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <div role="group" aria-label="Kind of paper" className="flex flex-wrap gap-1.5">
          {(["All", ...groups] as Filter[]).map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={group === g}
              onClick={() => setGroup(g)}
              className={`h-8 rounded-sm border px-3 text-sm font-medium transition-colors ${
                group === g ? "border-ink bg-ink text-white" : "border-rule-2 bg-white text-ink-2 hover:border-ink hover:text-ink"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <label className="relative block w-full sm:w-72">
          <span className="sr-only">Search the record</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-3" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or file name"
            className="h-10 w-full rounded-sm border border-rule-2 bg-white pr-3 pl-9 text-sm text-ink placeholder:text-ink-3 hover:border-ink-3 focus:border-blue focus:ring-3 focus:ring-blue/15 focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-5">
        <Register
          view="client"
          lines={lines}
          empty={onRecord.length === 0 ? "No papers on record yet. The first one you upload starts your record." : "No paper on your record matches that."}
        />
      </div>
    </div>
  );
}
