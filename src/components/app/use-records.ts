"use client";

import { useMemo } from "react";
import { useDemo } from "@/lib/store";

/** The signed-in customer's own files and papers. */
export function useMine() {
  const { session, clients, files, docs } = useDemo();
  const clientId = session?.role === "customer" ? session.clientId : undefined;

  return useMemo(() => {
    const client = clients.find((c) => c.id === clientId);
    const mine = files.filter((f) => f.clientId === clientId);
    const ids = new Set(mine.map((f) => f.id));
    return { client, files: mine, docs: docs.filter((d) => ids.has(d.fileId)) };
  }, [clientId, clients, files, docs]);
}

/** The signed-in officer's name. */
export function useOfficer(): string {
  const { session } = useDemo();
  return session?.role === "staff" ? session.name : "EasyMarg";
}
