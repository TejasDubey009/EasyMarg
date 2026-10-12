import Link from "next/link";
import { FileSheet } from "@/components/site/file-sheet";
import { HeroRoad } from "@/components/site/hero-road";
import { RegisterSample } from "@/components/site/register-sample";
import { RoadExplorer } from "@/components/site/road-explorer";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";
import { Section } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { Stamp } from "@/components/ui/stamp";

/* What is true of every service EasyMarg runs, whichever desk it comes from. */
const PRINCIPLES = [
  {
    title: "One officer",
    body: "A named person owns your case from the first paper to the last. You never start again with someone new.",
  },
  {
    title: "One file",
    body: "Each piece of work gets a file number, a set of milestones and a list of papers. You can see where it stands at any hour.",
  },
  {
    title: "One record",
    body: "Every paper is checked, numbered and kept for life, across every service you ever use with us.",
  },
];

const DESKS = [
  {
    href: "/home-loans",
    audience: "For individuals",
    title: "Home loans after a decline",
    body: "A bank's scorecard said no. That is one lender's answer, not every lender's. We build the file a housing finance company will read in full.",
    facts: [
      { label: "Who it is for", value: "Salaried or self-employed applicants with a low score, missed EMIs, a settled account, or no credit history at all." },
      { label: "What you get", value: "A straight answer on where you stand, then one case officer from the first paper to disbursal." },
    ],
  },
  {
    href: "/treasury",
    audience: "For companies",
    title: "Treasury for growing companies",
    body: "Five bank accounts, three lenders, a limit up for renewal and dollars due in ninety days. We run that work as your treasury desk.",
    facts: [
      { label: "Who it is for", value: "Finance heads managing cash, limits and bank relationships without a treasury team of their own." },
      { label: "What you get", value: "A desk that reports to your finance head, inside a policy your board has approved." },
    ],
  },
];

const REFUSALS = [
  {
    title: "Promise an outcome.",
    body: "Lenders and banks decide, not us. If your case is not ready we will say so on the first call, and tell you what would make it ready.",
  },
  {
    title: "Act without your say-so.",
    body: "Nothing goes to a lender or a bank until you have seen it and approved it. That includes any enquiry that would be written onto your credit report.",
  },
  {
    title: "Ask for your OTP, PIN or net-banking password.",
    body: "No EasyMarg officer ever will. If someone using our name does, it is not us. Tell us.",
  },
  {
    title: "Leave you guessing.",
    body: "Your file shows where it is, who has it and what it is waiting for. You should never have to call to find out.",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteNav tone="blue" />

      <div className="on-blue relative isolate overflow-hidden bg-blue text-white">
        <div className="wrap relative pt-10 md:pt-16">
          {/* The scene fills the brand block and stops where the paper begins, a little way under the sheet. */}
          <HeroRoad className="absolute top-0 -bottom-44 left-1/2 -z-10 h-[calc(100%+11rem)] w-screen -translate-x-1/2" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="t-label text-blue-tint">
              Marg <span aria-hidden="true">·</span>{" "}
              <span lang="hi" className="font-deva text-[0.8125rem] tracking-normal">
                मार्ग
              </span>{" "}
              <span aria-hidden="true">·</span> a road; a way through
            </p>
            <Link
              href="/showcase"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-xs transition-all duration-150 hover:bg-white/20 hover:border-white/40"
            >
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>4 Landing Page Templates</span>
              <span className="opacity-70">&rarr;</span>
            </Link>
          </div>
          <h1 className="t-display mt-5 max-w-[12.5em]">Financial services, with a way through.</h1>
          <p className="t-lede mt-7 max-w-[52ch] text-white/90">
            EasyMarg is one destination for the financial work that people and companies find hardest to get done. Tell us what you need. One case
            officer carries it from the first paper to the last, and every document stays on your record for life.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/login?start=file" variant="on-blue" className="group">
              Start a file
              <ArrowRight className="transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="/showcase" variant="on-blue-line">
              Explore Templates (4)
            </ButtonLink>
            <ButtonLink href="#services" variant="on-blue-line">
              See what we do
            </ButtonLink>
          </div>
        </div>

        {/* The sheet straddles the edge of the brand block, like a paper laid on a desk. */}
        <div className="relative mt-12 md:mt-16">
          <div aria-hidden="true" className="absolute inset-x-0 top-28 bottom-0 -z-[5] bg-white" />
          {/* Where the brand block ends. The bar above turns to paper when this line passes under it. */}
          <span aria-hidden="true" data-nav-flip className="absolute inset-x-0 top-28 h-px" />
          <div className="wrap">
            <FileSheet />
          </div>
        </div>
      </div>

      <main>
        <Section
          wide
          title="One destination. Every service runs the same way."
          lede="A loan, a credit limit, a company's cash: the work differs, the way we do it does not. Three things hold for anything you bring us."
        >
          <ul className="grid gap-x-10 gap-y-8 md:grid-cols-3">
            {PRINCIPLES.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 90} className="border-t border-ink pt-5">
                <h3 className="text-[1.5rem] leading-tight font-semibold tracking-[-0.018em] [font-stretch:110%]">{item.title}</h3>
                <p className="mt-3 max-w-[38ch] text-ink-2">{item.body}</p>
              </Reveal>
            ))}
          </ul>
        </Section>

        <Section
          id="services"
          tone="paper"
          wide
          title="Two desks are open."
          lede="We open one desk at a time, and only once we can run it properly. These are the two you can walk into today."
        >
          <ul className="border-b border-rule-2">
            {DESKS.map((desk, i) => (
              <Reveal as="li" key={desk.href} delay={i * 90}>
                <Link
                  href={desk.href}
                  className="group relative grid gap-x-10 gap-y-6 border-t border-rule-2 py-9 transition-[background-color,padding] duration-300 ease-out hover:bg-white md:grid-cols-12 md:py-11 md:hover:px-6"
                >
                  {/* The rule along the top inks in as you point at the row. */}
                  <span aria-hidden="true" className="absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-blue transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  <div className="md:col-span-5">
                    <p className="flex items-center gap-3">
                      <span className="t-label text-blue">{desk.audience}</span>
                      <Stamp tone="ok">Open</Stamp>
                    </p>
                    <h3 className="mt-3 text-[1.625rem] leading-tight font-semibold tracking-[-0.018em] [font-stretch:110%]">{desk.title}</h3>
                    <p className="mt-3 max-w-[44ch] text-ink-2">{desk.body}</p>
                  </div>
                  <dl className="md:col-span-6">
                    {desk.facts.map((fact) => (
                      <div key={fact.label} className="grid gap-x-6 gap-y-1 border-t border-rule-2 py-3 text-sm first:border-t-0 sm:grid-cols-[8rem_1fr]">
                        <dt className="text-ink-3">{fact.label}</dt>
                        <dd className="text-ink">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <span className="flex items-start md:col-span-1 md:justify-end">
                    <span className="inline-flex size-11 items-center justify-center rounded-md border border-rule-2 text-ink transition-[background-color,border-color,color] duration-200 ease-out group-hover:border-blue group-hover:bg-blue group-hover:text-white">
                      <ArrowRight className="transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                    </span>
                    <span className="sr-only">Read about {desk.title}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 max-w-[60ch] text-sm text-ink-2">
            More desks will open here. Each will work the way these two do: one officer, one file, one record.
          </p>
        </Section>

        <Section
          id="road"
          wide
          title="How a file moves."
          lede="Every service has its own road. Choose one and walk it: who has to act at each milestone, and which paper joins your record when it is passed."
        >
          <Reveal>
            <RoadExplorer />
          </Reveal>
        </Section>

        <Section
          id="record-room"
          tone="paper"
          title="The record room."
          lede="Every paper you give us, and every paper a lender or a bank issues to you, is filed against your name: numbered, dated, checked."
        >
          <Reveal>
            <RegisterSample />
          </Reveal>
          <div className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-3">
            {[
              { title: "Kept for life", body: "Nothing is deleted when a file closes. Need a 2026 sanction letter for a balance transfer in 2041? It is where you left it." },
              { title: "Numbered like a file", body: "Paper 07 of file 00418 is written 00418/07, on the register and on every message about it." },
              { title: "Yours to take", body: "Download any paper, or the whole record, whenever you want it. It is your record. We are the ones keeping it." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 90} className="border-t border-ink pt-4">
                <h3 className="t-h3">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section
          title="Four things we will not do."
          lede="Financial services are sold on a great many promises. These are ours, and they are mostly about what does not happen."
        >
          <ul className="border-t border-rule">
            {REFUSALS.map((item, i) => (
              <Reveal
                as="li"
                key={item.title}
                delay={i * 110}
                className="grid gap-x-8 gap-y-1.5 border-b border-rule py-5 sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
              >
                <h3 className="t-h3">
                  <span className="strike">{item.title}</span>
                </h3>
                <p className="text-ink-2">{item.body}</p>
              </Reveal>
            ))}
          </ul>
        </Section>

        <section className="on-blue bg-blue text-white">
          <div className="wrap grid gap-x-10 gap-y-8 py-16 md:grid-cols-12 md:items-end md:py-20">
            <Reveal className="md:col-span-7">
              <h2 className="t-h2">Already have a file with us?</h2>
              <p className="mt-4 max-w-[52ch] text-white/90">
                Sign in to see where it stands, upload what it is waiting for, and open your record room.
              </p>
            </Reveal>
            <ul className="md:col-span-5">
              {[
                { href: "/login", label: "Customer sign-in", note: "Individuals and companies" },
                { href: "/login?as=team", label: "EasyMarg team sign-in", note: "Case officers and the desk" },
              ].map((door) => (
                <li key={door.href} className="border-t border-white/25 last:border-b">
                  <Link href={door.href} className="group flex items-center justify-between gap-4 py-4 transition-[padding] duration-200 ease-out hover:pl-2">
                    <span>
                      <span className="block font-semibold">{door.label}</span>
                      <span className="block text-sm text-white/75">{door.note}</span>
                    </span>
                    <ArrowRight className="text-white/70 transition-[transform,color] duration-200 ease-out group-hover:translate-x-1 group-hover:text-white" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
