import type { Metadata } from "next";
import { RoadColumn } from "@/components/road";
import { ScoreScale } from "@/components/site/score-scale";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";
import { PageHead, Section } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { ROAD } from "@/lib/data";

export const metadata: Metadata = {
  title: "Home loans after a decline",
  description:
    "Turned down for a home loan because of a low CIBIL score, missed EMIs or a settled account? EasyMarg reads your credit report, builds the file and takes it to lenders whose policy fits it.",
};

const REASONS = [
  {
    mark: "Missed EMIs",
    sees: "Days-past-due entries against a loan or card in the last two or three years.",
    does: "An explanation letter with proof behind it: closure letters, no-dues certificates, and recent statements showing every payment on time.",
  },
  {
    mark: "A settled or written-off account",
    sees: "The words “settled” or “written off”. Lenders read both as money that was never fully repaid.",
    does: "Where it can be done, pay the balance, have the status changed to “closed”, and file the lender's no-dues certificate.",
  },
  {
    mark: "Cards near their limit",
    sees: "Balances close to the limit, month after month.",
    does: "A paydown plan before we submit, so the report the next lender pulls is not the report that got you declined.",
  },
  {
    mark: "Too many applications",
    sees: "Several loan enquiries inside a few months. It reads as someone being refused everywhere.",
    does: "Stop applying. We wait, then go to a short list rather than a long one.",
  },
  {
    mark: "No credit history",
    sees: "Nothing to score.",
    does: "Lenders that assess income and banking instead of a score. Sometimes a co-applicant who has a history.",
  },
  {
    mark: "Income without paperwork",
    sees: "Cash or informal income that does not show on a tax return.",
    does: "Assessment on bank statements and GST returns, with lenders that accept it.",
  },
  {
    mark: "An error on the report",
    sees: "A loan that is not yours, or a closed loan still shown as open.",
    does: "A dispute with the bureau, filed and followed up, before anything else moves.",
  },
];

const PAPERS = [
  { group: "Identity", items: ["PAN card", "Aadhaar; a masked copy is fine", "The same two for any co-applicant"] },
  {
    group: "Income",
    items: ["Salaried: salary slips for 3 months and Form 16 for 2 years", "Self-employed: ITRs with computation for 2 to 3 years, and GST returns"],
  },
  { group: "Banking", items: ["Statements for 12 months, for every account where salary or EMIs move", "As unlocked PDFs from the bank, not screenshots"] },
  { group: "Property", items: ["Agreement to sale, or the builder's allotment letter", "Title documents and the approved plan, as the lender's lawyer asks for them"] },
  {
    group: "Credit",
    items: ["Your credit report. We pull it, with your consent", "An explanation letter for each past mark. We draft it with you", "No-dues certificates for anything closed or settled"],
  },
];

export default function HomeLoansPage() {
  return (
    <>
      <SiteNav />
      <main>
        <PageHead
          label="Home loans"
          title="Declined once is not declined everywhere."
          lede="A bank lends by scorecard. Housing finance companies and NBFCs will often read the whole file: your income, how steady it is, the property, and the story behind a bad year. We build that file and take it to the lenders whose policy fits it."
        >
          <ButtonLink href="/login?start=home-loan" className="w-full sm:w-auto">
            Start a home-loan file
          </ButtonLink>
          <p className="mt-3 max-w-[34ch] text-sm text-ink-2">The first milestone is your credit report, read with you. Nothing goes to a lender before that.</p>
        </PageHead>

        <Section
          wide
          title="Why the bank said no, and what changes it."
          lede="A decline letter rarely gives the reason. The credit report does. These are the seven marks we see most, what a lender reads into each, and the work that answers it."
        >
          <div role="table" aria-label="Marks on a credit report and how each is answered">
            <div role="row" className="t-label hidden grid-cols-12 gap-x-8 border-b border-ink pb-2.5 text-ink-3 md:grid">
              <span role="columnheader" className="col-span-3">
                On your report
              </span>
              <span role="columnheader" className="col-span-4">
                What the lender sees
              </span>
              <span role="columnheader" className="col-span-5">
                What we do about it
              </span>
            </div>
            {REASONS.map((reason) => (
              <div
                key={reason.mark}
                role="row"
                className="group grid gap-x-8 gap-y-2 border-b border-rule py-5 transition-[background-color,padding] duration-200 ease-out hover:bg-paper md:grid-cols-12 md:hover:px-4"
              >
                <h3 role="cell" className="t-h3 transition-colors duration-200 group-hover:text-blue md:col-span-3">
                  {reason.mark}
                </h3>
                <p role="cell" className="text-ink-2 md:col-span-4">
                  <span className="t-label mb-0.5 block text-ink-3 md:hidden">What the lender sees</span>
                  {reason.sees}
                </p>
                <p role="cell" className="text-ink md:col-span-5">
                  <span className="t-label mb-0.5 block text-ink-3 md:hidden">What we do about it</span>
                  {reason.does}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          tone="paper"
          title="Where your score puts you."
          lede="A CIBIL score runs from 300 to 900. Lenders do not publish their cut-offs, but they cluster. Find your place on the ruler."
        >
          <Reveal className="rounded-sm border border-rule-2 bg-white p-5 sm:p-8">
            <ScoreScale />
          </Reveal>
        </Section>

        <Section
          title="What goes in the file."
          lede="You upload each paper once. An officer checks it, stamps it, and it stays on your record for life, whichever lender the file ends up with."
        >
          <dl className="border-t border-rule">
            {PAPERS.map((set) => (
              <div
                key={set.group}
                className="grid gap-x-8 gap-y-2 border-b border-rule py-5 transition-[background-color,padding] duration-200 ease-out hover:bg-paper sm:grid-cols-[9rem_1fr] sm:hover:px-4"
              >
                <dt className="t-label pt-1 text-blue">{set.group}</dt>
                <dd>
                  <ul className="space-y-1.5">
                    {set.items.map((item) => (
                      <li key={item} className="text-ink">
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section
          tone="paper"
          title="The road, stone by stone."
          lede="Six milestones. Your file shows which one it is standing at, who has to act next, and since when."
        >
          <Reveal>
            <RoadColumn milestones={ROAD["home-loan"]} stage={ROAD["home-loan"].length} view="public" />
          </Reveal>
        </Section>

        <section className="on-blue bg-blue text-white">
          <div className="wrap grid gap-x-10 gap-y-8 py-16 md:grid-cols-12 md:items-end md:py-20">
            <div className="md:col-span-8">
              <h2 className="t-h2">Start with the report, not the application.</h2>
              <p className="mt-4 max-w-[58ch] text-white/90">
                Tell us about the loan and give your consent. We read your credit report and tell you where you stand before a
                single lender hears your name.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <ButtonLink href="/login?start=home-loan" variant="on-blue" className="group">
                Start a home-loan file
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
