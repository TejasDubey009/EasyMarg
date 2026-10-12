"use client";

import { useMemo, useState } from "react";
import { Register } from "@/components/app/register";
import { SelectField } from "@/components/ui/field";
import { Search } from "@/components/ui/icons";
import { useDemo } from "@/lib/store";

export default function ArchivePage() {
  const { files, docs, clients } = useDemo();
  const [query, setQuery] = useState("");
  const [clientId, setClientId] = useState("all");

  const onRecord = useMemo(
    () =>
      docs
        .filter((d) => d.status !== "needed")
        .sort((a, b) => (b.filedOn! > a.filedOn! ? 1 : b.filedOn! < a.filedOn! ? -1 : b.serial - a.serial)),
    [docs],
  );

  const lines = onRecord
    .map((doc) => {
      const file = files.find((f) => f.id === doc.fileId)!;
      return { doc, file, client: clients.find((c) => c.id === file.clientId)?.name };
    })
    .filter((line) => clientId === "all" || line.file.clientId === clientId)
    .filter((line) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return [line.doc.title, line.doc.filename ?? "", line.file.no, line.client ?? ""].some((text) => text.toLowerCase().includes(q));
    });

  return (
    <div>
      <header>
        <p className="t-label text-ink-3">Kept for life</p>
        <h1 className="t-h1 mt-3">Archive</h1>
        <p className="mt-3 max-w-[60ch] text-ink-2">
          {onRecord.length} papers on record for {clients.length} clients. Papers stay here after a file closes; nothing in the archive can be deleted from
          the desk.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-[16rem_1fr] sm:items-end">
        <SelectField label="Client" value={clientId} onChange={(event) => setClientId(event.target.value)}>
          <option value="all">All clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </SelectField>
        <label className="relative block sm:max-w-sm">
          <span className="sr-only">Search the archive</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-3" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Paper, file name, file no. or client"
            className="h-11 w-full rounded-sm border border-rule-2 bg-white pr-3 pl-9 text-sm text-ink placeholder:text-ink-3 hover:border-ink-3 focus:border-blue focus:ring-3 focus:ring-blue/15 focus:outline-none"
          />
        </label>
      </div>

      <p className="t-data mt-8 text-ink-3">
        {lines.length} {lines.length === 1 ? "paper" : "papers"}
      </p>
      <div className="mt-2">
        <Register view="desk" lines={lines} empty="No paper in the archive matches that." />
      </div>
    </div>
  );
}
