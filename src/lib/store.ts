"use client";

/*
  Demo store. There is no server behind this build: records live in the
  browser's localStorage (shared across tabs, so a customer tab and a desk tab
  see the same file) and the signed-in session lives in sessionStorage (per tab).
  Replace this module with real API calls; the pages only use `useDemo` and `demo`.
*/

import { useSyncExternalStore } from "react";
import {
  CHECKLIST,
  KIND_CODE,
  ROAD,
  SEED,
  type CaseFile,
  type DemoState,
  type Doc,
  type DocGroup,
  type Kind,
  type Party,
  type Session,
} from "./data";
import { today } from "./format";

const RECORDS_KEY = "easymarg.demo.records.v1";
const SESSION_KEY = "easymarg.demo.session.v1";

type Records = Pick<DemoState, "clients" | "files" | "docs">;

let state: DemoState | null = null;
let listening = false;
const listeners = new Set<() => void>();

function parse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function read(): DemoState {
  if (state) return state;
  let records: Records | null = null;
  let session: Session | null = null;
  try {
    records = parse<Records>(window.localStorage.getItem(RECORDS_KEY));
    session = parse<Session>(window.sessionStorage.getItem(SESSION_KEY));
  } catch {
    // Storage can be blocked. The demo still runs, it just forgets on reload.
  }
  state = { ...(records ?? SEED), session };
  return state;
}

function write(next: DemoState) {
  state = next;
  try {
    const { session, ...records } = next;
    window.localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    if (session) window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // See above.
  }
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  if (!listening) {
    listening = true;
    // Another tab changed the records: drop our copy and read again.
    window.addEventListener("storage", (event) => {
      if (event.key !== RECORDS_KEY) return;
      state = null;
      listeners.forEach((each) => each());
    });
  }
  return () => {
    listeners.delete(notify);
  };
}

const serverSnapshot = () => SEED;
const noop = () => () => {};

export function useDemo(): DemoState {
  return useSyncExternalStore(subscribe, read, serverSnapshot);
}

/** False on the server and during hydration, true once the browser's own records are in play. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/* ───────────────────────── helpers ───────────────────────── */

const PARTY_WAIT: Record<Party, string> = {
  you: "Waiting on the client.",
  easymarg: "With EasyMarg.",
  lender: "With the lender.",
};

function patchFile(s: DemoState, fileId: string, patch: (file: CaseFile) => CaseFile): CaseFile[] {
  return s.files.map((file) => (file.id === fileId ? patch(file) : file));
}

function log(file: CaseFile, by: string, text: string): CaseFile["activity"] {
  return [{ on: today(), by, text }, ...file.activity];
}

function clientName(s: DemoState, file: CaseFile): string {
  return s.clients.find((c) => c.id === file.clientId)?.name ?? "Client";
}

/** After the client files something, work out who the file is waiting on now. */
function afterClientFiling(file: CaseFile, docs: Doc[]): Pick<CaseFile, "waitingOn" | "waitingFor"> {
  if (file.waitingOn !== "you") return { waitingOn: file.waitingOn, waitingFor: file.waitingFor };
  const open = docs.filter((d) => d.fileId === file.id && (d.status === "needed" || d.status === "reupload")).length;
  if (open > 0) {
    return { waitingOn: "you", waitingFor: `${open} ${open === 1 ? "paper" : "papers"} still needed from you.` };
  }
  return { waitingOn: "easymarg", waitingFor: "New papers are waiting to be checked." };
}

/* ───────────────────────── actions ───────────────────────── */

export type Upload = { filename: string; sizeKb: number };

export type NewFile = {
  kind: Kind;
  clientId: string;
  subject: string;
  amount: number;
  facts: { label: string; value: string }[];
};

export const demo = {
  signIn(session: Session) {
    write({ ...read(), session });
  },

  signOut() {
    write({ ...read(), session: null });
  },

  /** Put the sample records back the way they shipped. */
  reset() {
    const s = read();
    write({ ...SEED, session: s.session });
  },

  /** The client uploads a paper the file was asking for. */
  filePaper(docId: string, upload: Upload) {
    const s = read();
    const doc = s.docs.find((d) => d.id === docId);
    if (!doc) return;
    const docs = s.docs.map((d): Doc =>
      d.id === docId
        ? { ...d, ...upload, status: "filed", filedOn: today(), filedBy: "client", issues: undefined, checkedBy: undefined, checkedOn: undefined }
        : d,
    );
    const files = patchFile(s, doc.fileId, (file) => ({
      ...file,
      ...afterClientFiling(file, docs),
      activity: log(file, clientName(s, file), `Filed: ${doc.title}.`),
    }));
    write({ ...s, docs, files });
  },

  /** Add a paper nobody asked for yet. It joins the record all the same. */
  addPaper(fileId: string, paper: { title: string; group: DocGroup } & Upload, by: "client" | "easymarg", officer?: string) {
    const s = read();
    const file = s.files.find((f) => f.id === fileId);
    if (!file) return;
    const serial = Math.max(0, ...s.docs.filter((d) => d.fileId === fileId).map((d) => d.serial)) + 1;
    const doc: Doc = {
      id: `${fileId}-${String(serial).padStart(2, "0")}`,
      fileId,
      serial,
      title: paper.title,
      group: paper.group,
      filename: paper.filename,
      sizeKb: paper.sizeKb,
      filedOn: today(),
      filedBy: by,
      status: by === "easymarg" ? "verified" : "filed",
      checkedBy: by === "easymarg" ? officer : undefined,
      checkedOn: by === "easymarg" ? today() : undefined,
    };
    const files = patchFile(s, fileId, (f) => ({
      ...f,
      activity: log(f, by === "client" ? clientName(s, f) : (officer ?? "EasyMarg"), `Filed: ${paper.title}.`),
    }));
    write({ ...s, docs: [...s.docs, doc], files });
  },

  /** An officer has read the paper and it is good. */
  verify(docId: string, officer: string) {
    const s = read();
    const doc = s.docs.find((d) => d.id === docId);
    if (!doc) return;
    const docs = s.docs.map((d): Doc =>
      d.id === docId ? { ...d, status: "verified", checkedBy: officer, checkedOn: today(), issues: undefined } : d,
    );
    const files = patchFile(s, doc.fileId, (file) => ({ ...file, activity: log(file, officer, `Checked: ${doc.title}.`) }));
    write({ ...s, docs, files });
  },

  /** An officer sends a paper back, and says exactly why. */
  sendBack(docId: string, issue: { label: string; detail: string }, officer: string) {
    const s = read();
    const doc = s.docs.find((d) => d.id === docId);
    if (!doc) return;
    const docs = s.docs.map((d): Doc =>
      d.id === docId ? { ...d, status: "reupload", issues: [issue], checkedBy: undefined, checkedOn: undefined } : d,
    );
    const files = patchFile(s, doc.fileId, (file) => ({
      ...file,
      waitingOn: "you",
      waitingFor: `${doc.title} needs to be uploaded again.`,
      activity: log(file, officer, `Sent back: ${doc.title}. ${issue.label}.`),
    }));
    write({ ...s, docs, files });
  },

  /** Pass the current milestone and move the file up the road. */
  advance(fileId: string, officer: string) {
    const s = read();
    const files = patchFile(s, fileId, (file) => {
      const road = ROAD[file.kind];
      if (file.stage >= road.length) return file;
      const passed = road[file.stage];
      const next = road[file.stage + 1];
      return {
        ...file,
        stage: file.stage + 1,
        passed: [...file.passed, today()],
        stageSince: today(),
        waitingOn: next ? next.who : "easymarg",
        waitingFor: next ? PARTY_WAIT[next.who] : "Road complete. Every paper stays on record.",
        activity: log(file, officer, `Passed: ${passed.title}.`),
      };
    });
    write({ ...s, files });
  },

  note(fileId: string, text: string, by: string) {
    const s = read();
    write({ ...s, files: patchFile(s, fileId, (file) => ({ ...file, activity: log(file, by, text) })) });
  },

  /** Open a new file with its starting checklist. Returns the new file's id. */
  open(input: NewFile): string {
    const s = read();
    const code = KIND_CODE[input.kind];
    const last = Math.max(
      0,
      ...s.files.filter((f) => f.kind === input.kind).map((f) => Number(f.no.split("/").pop())),
    );
    const serial = String(last + 1).padStart(5, "0");
    const id = `${code.toLowerCase()}-${serial}`;
    const first = ROAD[input.kind][0];
    const file: CaseFile = {
      id,
      no: `EM/${code}/${today().slice(2, 4)}/${serial}`,
      kind: input.kind,
      clientId: input.clientId,
      subject: input.subject,
      amount: input.amount,
      amountLabel: input.kind === "home-loan" ? "Loan sought" : "Limits in scope",
      stage: 0,
      passed: [],
      stageSince: today(),
      waitingOn: first.who,
      waitingFor:
        input.kind === "home-loan"
          ? "Credit report to be read. You can start uploading papers now."
          : "Mandate letter to be signed. Your case officer will send it.",
      openedOn: today(),
      officer: input.kind === "home-loan" ? "Priya Nair" : "Arvind Menon",
      facts: input.facts,
      activity: [{ on: today(), by: "EasyMarg", text: "File opened." }],
    };
    const docs: Doc[] = CHECKLIST[input.kind].map((item, i) => ({
      ...item,
      id: `${id}-${String(i + 1).padStart(2, "0")}`,
      fileId: id,
      serial: i + 1,
      status: "needed",
    }));
    write({ ...s, files: [file, ...s.files], docs: [...s.docs, ...docs] });
    return id;
  },
};
