/*
  Page furniture. Sections open with a full-width ink rule, the way a new
  section of a ledger does; the heading sits in the margin column and the
  matter sits beside it.
*/

export function Section({
  id,
  title,
  lede,
  children,
  tone = "white",
  wide = false,
}: {
  id?: string;
  title: string;
  lede?: React.ReactNode;
  children: React.ReactNode;
  tone?: "white" | "paper";
  /** Heading above, matter across the full measure. For matter that needs the width. */
  wide?: boolean;
}) {
  return (
    <section id={id} className={tone === "paper" ? "bg-paper" : "bg-white"}>
      <div className="wrap py-16 md:py-24">
        <div className="grid gap-x-10 gap-y-8 border-t border-ink pt-6 md:grid-cols-12 md:pt-8">
          <header className={wide ? "grid gap-x-10 gap-y-4 md:col-span-12 md:grid-cols-12" : "md:col-span-4"}>
            <h2 className={`t-h2 ${wide ? "md:col-span-5" : ""}`}>{title}</h2>
            {lede && <p className={`max-w-[56ch] text-ink-2 ${wide ? "md:col-span-6 md:col-start-7 md:pt-1" : "mt-4"}`}>{lede}</p>}
          </header>
          <div className={wide ? "md:col-span-12 md:mt-6" : "md:col-span-8"}>{children}</div>
        </div>
      </div>
    </section>
  );
}

/** Label and value, one per line, ruled. For facts that are looked up rather than read. */
export function Facts({ rows, className }: { rows: { label: string; value: React.ReactNode }[]; className?: string }) {
  return (
    <dl className={["border-t border-rule", className].filter(Boolean).join(" ")}>
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[minmax(7.5rem,2fr)_3fr] gap-4 border-b border-rule py-3 text-sm sm:grid-cols-[11rem_1fr]">
          <dt className="text-ink-3">{row.label}</dt>
          <dd className="min-w-0 text-ink [font-variant-numeric:tabular-nums]">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The header of an inside page: what this page is, in a paper band. */
export function PageHead({
  label,
  title,
  lede,
  children,
}: {
  label: string;
  title: string;
  lede: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-rule bg-paper">
      <div className="wrap grid gap-x-10 gap-y-8 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-8">
          <p className="t-label text-blue">{label}</p>
          <h1 className="t-h1 mt-4 max-w-[18ch]">{title}</h1>
          <p className="t-lede mt-6 max-w-[58ch] text-ink-2">{lede}</p>
        </div>
        {children && <div className="md:col-span-4 md:self-end">{children}</div>}
      </div>
    </div>
  );
}
