import type { DocStatus, Party } from "@/lib/data";

/*
  A stamp is what an officer puts on a paper once they have looked at it.
  Here it carries the state of a paper or of a file, and nothing else.
*/

export type Tone = "ok" | "wait" | "stop" | "blue" | "plain";

const TONES: Record<Tone, string> = {
  ok: "border-ok/35 bg-ok-wash text-ok",
  wait: "border-wait/35 bg-wait-wash text-wait",
  stop: "border-stop/35 bg-stop-wash text-stop",
  blue: "border-blue/30 bg-blue-wash text-blue",
  plain: "border-rule-2 bg-white text-ink-2",
};

export function Stamp({ tone = "plain", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={[
        "t-label inline-flex items-center rounded-xs border px-1.5 py-[3px] font-medium whitespace-nowrap",
        TONES[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}

const DOC: Record<DocStatus, { tone: Tone; client: string; desk: string }> = {
  needed: { tone: "plain", client: "Needed", desk: "Not filed" },
  filed: { tone: "wait", client: "Being checked", desk: "To check" },
  verified: { tone: "ok", client: "Checked", desk: "Checked" },
  reupload: { tone: "stop", client: "Upload again", desk: "Sent back" },
};

export function PaperStamp({ status, view = "client" }: { status: DocStatus; view?: "client" | "desk" }) {
  const s = DOC[status];
  return <Stamp tone={s.tone}>{s[view]}</Stamp>;
}

/** Who a file is waiting on. Blue means it is waiting on whoever is looking at the screen. */
export function WaitingStamp({ party, view = "client" }: { party: Party; view?: "client" | "desk" }) {
  const mine = view === "client" ? party === "you" : party === "easymarg";
  const label =
    party === "you"
      ? view === "client"
        ? "Waiting on you"
        : "With client"
      : party === "easymarg"
        ? view === "client"
          ? "With EasyMarg"
          : "With us"
        : "With lender";
  return <Stamp tone={mine ? "blue" : "wait"}>{label}</Stamp>;
}
