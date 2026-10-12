import type { Metadata } from "next";
import { RoadStrip } from "@/components/road";
import { PositionSheet } from "@/components/site/position-sheet";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";
import { PageHead, Section } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { ROAD } from "@/lib/data";

export const metadata: Metadata = {
  title: "Treasury for growing companies",
  description:
    "EasyMarg runs treasury as a desk for companies without one: a daily cash position, working-capital renewals, options for surplus cash and an FX exposure register, reporting to your finance head.",
};

const WORK = [
  {
    name: "Cash position",
    does: "One sheet every morning: balances across your banks, limits drawn, headroom left, and what falls due this week.",
    paper: "Daily position sheet",
  },
  {
    name: "Working capital",
    does: "Cash credit, overdraft and bill discounting. We prepare the CMA data and stock statements, and sit in the renewal meetings with you.",
    paper: "Renewal file",
  },
  {
    name: "Surplus cash",
    does: "When balances sit idle we set out the options your board's policy allows, with tenor and maturity for each. You choose, and you instruct your bank.",
    paper: "Placement note",
  },
  {
    name: "FX exposure",
    does: "Foreign-currency receivables and payables mapped by date, against the hedge ratio you have set. Forwards are booked by you, through your bank.",
    paper: "Exposure register",
  },
  {
    name: "Borrowing",
    does: "Term loans and refinancing: a lender shortlist, term sheets compared line by line, and a calendar of covenants so none is missed.",
    paper: "Term-sheet comparison",
  },
];

const ROLES = [
  { who: "Your board", does: "Approves the treasury policy: where surplus may be placed, and how much FX exposure may stay open." },
  { who: "Your finance head", does: "Instructs the bank on every placement, drawdown and forward. The desk reports to them." },
  { who: "The EasyMarg desk", does: "Prepares, tracks, reconciles and reports. It never holds your money and never moves it." },
];

export default function TreasuryPage() {
  return (
    <>
      <SiteNav />
      <main>
        <PageHead
          label="Treasury"
          title="A treasury desk for companies that do not have one."
          lede="Past a certain size, cash stops managing itself. Five bank accounts, three lenders, a limit up for renewal, dollars due in ninety days. We run that work as your desk and report to your finance head."
        >
          <ButtonLink href="/login?start=treasury" className="w-full sm:w-auto">
            Open a treasury mandate
          </ButtonLink>
          <p className="mt-3 max-w-[34ch] text-sm text-ink-2">It starts with a mandate letter: scope, access and reporting line, in writing.</p>
        </PageHead>

        <Section
          wide
          title="What the desk does."
          lede="Five lines of work. Each one produces a paper you can hold us to, filed on your record the day it is issued."
        >
          <div role="table" aria-label="Work of the treasury desk">
            <div role="row" className="t-label hidden grid-cols-12 gap-x-8 border-b border-ink pb-2.5 text-ink-3 md:grid">
              <span role="columnheader" className="col-span-3">
                Work
              </span>
              <span role="columnheader" className="col-span-6">
                What happens
              </span>
              <span role="columnheader" className="col-span-3">
                Paper you receive
              </span>
            </div>
            {WORK.map((line) => (
              <div
                key={line.name}
                role="row"
                className="group grid gap-x-8 gap-y-2 border-b border-rule py-5 transition-[background-color,padding] duration-200 ease-out hover:bg-paper md:grid-cols-12 md:hover:px-4"
              >
                <h3 role="cell" className="t-h3 transition-colors duration-200 group-hover:text-blue md:col-span-3">
                  {line.name}
                </h3>
                <p role="cell" className="text-ink-2 md:col-span-6">
                  {line.does}
                </p>
                <p role="cell" className="text-ink md:col-span-3">
                  <span className="t-label mb-0.5 block text-ink-3 md:hidden">Paper you receive</span>
                  {line.paper}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          tone="paper"
          title="One sheet, every morning."
          lede="The position sheet is the desk's first job each day. Cash, limits, headroom and what is due, on a single page your finance head can read in a minute."
        >
          <Reveal>
            <PositionSheet />
          </Reveal>
        </Section>

        <Section
          title="Who decides what."
          lede="A treasury desk works only if the lines of authority are plain. These are ours."
        >
          <dl className="border-t border-rule">
            {ROLES.map((role) => (
              <div
                key={role.who}
                className="grid gap-x-8 gap-y-1.5 border-b border-rule py-5 transition-[background-color,padding] duration-200 ease-out hover:bg-paper sm:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] sm:hover:px-4"
              >
                <dt className="t-h3">{role.who}</dt>
                <dd className="text-ink-2">{role.does}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section
          wide
          tone="paper"
          title="How a mandate runs."
          lede="Five milestones. Once the desk is live, the last one comes round again every quarter."
        >
          <Reveal>
            <RoadStrip milestones={ROAD.treasury} stage={ROAD.treasury.length} detail />
          </Reveal>
        </Section>

        <section className="on-blue bg-blue text-white">
          <div className="wrap grid gap-x-10 gap-y-8 py-16 md:grid-cols-12 md:items-end md:py-20">
            <div className="md:col-span-8">
              <h2 className="t-h2">Begin with a reading of where you stand.</h2>
              <p className="mt-4 max-w-[58ch] text-white/90">
                Open a mandate request and upload twelve months of statements and your sanction letters. The first paper back is a
                position note: every account, limit and loan on one sheet.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <ButtonLink href="/login?start=treasury" variant="on-blue" className="group">
                Open a treasury mandate
                <ArrowRight className="transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
