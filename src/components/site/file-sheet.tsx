import { RoadStrip } from "@/components/road";
import { Stamp, WaitingStamp } from "@/components/ui/stamp";
import { KIND_LABEL, ROAD, SEED } from "@/lib/data";
import { day, inr } from "@/lib/format";

/*
  The sample file shown on the home page. It is not a drawing of the product:
  it renders the same record, with the same components, that the signed-in
  customer sees.
*/
export function FileSheet() {
  const file = SEED.files[0];
  const papers = SEED.docs.filter((doc) => doc.fileId === file.id);
  const onRecord = papers.filter((doc) => doc.status !== "needed").length;

  return (
    <article aria-label="Sample file" className="rounded-sm border border-rule-2 bg-white text-ink">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-rule px-5 py-4 sm:px-7">
        <p className="flex items-baseline gap-3">
          <span className="t-label text-ink-3">File no.</span>
          <span className="t-data text-[0.875rem] font-medium text-ink">{file.no}</span>
        </p>
        <div className="flex items-center gap-2">
          <Stamp>Sample file</Stamp>
          <WaitingStamp party={file.waitingOn} />
        </div>
      </header>

      <div className="px-5 pt-6 pb-7 sm:px-7">
        <p className="text-[1.0625rem] font-semibold">
          {KIND_LABEL[file.kind]} <span className="font-normal text-ink-3">·</span>{" "}
          <span className="[font-variant-numeric:tabular-nums]">{inr(file.amount)}</span>{" "}
          <span className="font-normal text-ink-3">·</span> <span className="font-normal text-ink-2">{file.subject}</span>
        </p>
        <div className="mt-7">
          <RoadStrip milestones={ROAD[file.kind]} stage={file.stage} view="client" arrive />
        </div>
      </div>

      <dl className="grid gap-px overflow-hidden rounded-b-sm border-t border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Waiting for", value: "Bank statements, to upload again" },
          { label: "Here since", value: day(file.stageSince) },
          { label: "Case officer", value: file.officer },
          { label: "On record", value: `${onRecord} papers, kept for life` },
        ].map((item) => (
          <div key={item.label} className="bg-white px-5 py-4 sm:px-7">
            <dt className="t-label text-ink-3">{item.label}</dt>
            <dd className="mt-1 text-sm text-ink [font-variant-numeric:tabular-nums]">{item.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
