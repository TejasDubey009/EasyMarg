"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Mark } from "@/components/brand";
import { ArrowRight, ChevronDown } from "@/components/ui/icons";
import { BRAND, DESKS, FACTS, HOME_LOAN_ROAD, PRINCIPLES, RECORD_ROOM, REFUSALS, REGISTER } from "@/showcase/copy";
import { gsap, ScrollTrigger, stillPreferred } from "@/showcase/lib/gsap";
import { SmoothScroll } from "@/showcase/lib/smooth-scroll";
import { Counter } from "@/showcase/ui/counter";
import { Lines } from "@/showcase/ui/lines";
import { Magnetic } from "@/showcase/ui/magnetic";
import { usePointer } from "@/showcase/ui/pointer";
import { Rise } from "@/showcase/ui/rise";

const Scene = dynamic(() => import("./scene"), { ssr: false });

function Nav() {
  return (
    <header className="cl-nav">
      <Link href="/showcase/clay" aria-label="EasyMarg, Clay" className="flex items-center gap-2.5 pr-2">
        <Mark tone="current" />
        <span className="display-face text-[1.2rem]">EasyMarg</span>
      </Link>
      <nav aria-label="Main">
        <a href="#desks">Services</a>
        <a href="#road">How it works</a>
        <a href="#record">Record room</a>
      </nav>
      <div className="flex items-center gap-3 ml-auto">
        <Link
          href="/showcase"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white/40 px-2.5 py-1 text-xs text-black/80 transition-colors hover:bg-white hover:text-black"
        >
          <span>Templates</span>
          <span className="font-mono text-[10px] opacity-70">(4)</span>
        </Link>
        <Link href="/" className="hidden lg:inline text-xs text-black/60 transition-colors hover:text-black">
          Home
        </Link>
        <Link href="/login?start=file" className="cl-btn cl-btn--sm">
          Start a file
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const pointer = usePointer();
  const [passed, setPassed] = useState(0);

  useEffect(() => {
    const el = stage.current;
    if (!el || stillPreferred()) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
        setPassed(Math.min(6, Math.max(0, Math.floor((self.progress - 0.08) / 0.12) + 1)));
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={stage} className="cl-stage">
      <div className="cl-sticky cl-cushion">
        <Scene progress={progress} pointer={pointer} />
        <div className="cl-passed" aria-live="polite">
          <p className="label">Stones standing</p>
          <p className="display-face n">{passed}</p>
          <p className="mono text-[0.8125rem]">of 6</p>
        </div>
        <div className="cl-hero">
          <div className="max-w-[40rem]">
            <p className="label">{BRAND.meaning}</p>
            <Lines as="h1" className="display-face display mt-5" delay={0.2}>
              Hard financial work, handled by hand.
            </Lines>
            <Lines as="p" className="lede mt-6 max-w-[42ch]" delay={0.6} stagger={0.05}>
              EasyMarg is one destination for the finance people and companies find hardest to get done. A named officer carries each case from the first paper to the last, and every paper stays on your record for life.
            </Lines>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <Link href="/login?start=file" className="cl-btn">
                  Start a file
                  <ArrowRight className="arrow" />
                </Link>
              </Magnetic>
              <Magnetic>
                <a href="#desks" className="cl-btn cl-btn--ghost">
                  See what we do
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Principles() {
  return (
    <section className="cl-section">
      <div className="wrap-x">
        <Lines as="h2" className="display-face h2 max-w-[20ch]">
          One destination. Every service runs the same way.
        </Lines>
        <Rise className="mt-10 grid gap-4 md:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div key={p.n} data-rise className="cl-cushion p-7 md:p-8">
              <p className="display-face text-[4rem] leading-none">{p.n}</p>
              <h3 className="h3 display-face mt-10">{p.title}</h3>
              <p className="muted mt-3">{p.body}</p>
            </div>
          ))}
        </Rise>
      </div>
    </section>
  );
}

function Desks() {
  return (
    <section id="desks" className="cl-section pt-0">
      <div className="wrap-x">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <Lines as="h2" className="display-face h2 md:col-span-7">
            Two desks are open.
          </Lines>
          <p className="lede md:col-span-5">We open one desk at a time, and only once we can run it properly. These are the two you can walk into today.</p>
        </div>
        <Rise className="mt-10 grid gap-4 md:grid-cols-2">
          {DESKS.map((d) => (
            <Link key={d.href} href={d.href} data-rise className="cl-desk cl-cushion">
              <div className="flex items-start justify-between gap-4">
                <p className="label">{d.audience}</p>
                <span className="go" aria-hidden="true">
                  <ArrowRight />
                </span>
              </div>
              <h3 className="display-face h2 mt-6">{d.title}</h3>
              <p className="muted mt-4 max-w-[44ch]">{d.body}</p>
              <dl className="mt-8 grid gap-x-6 gap-y-3 border-t border-[var(--cl-line)] pt-5 text-[0.9375rem] sm:grid-cols-[7rem_1fr]">
                <dt className="faint">Who it is for</dt>
                <dd>{d.who}</dd>
                <dt className="faint">What you get</dt>
                <dd>{d.get}</dd>
                <dt className="faint">Road</dt>
                <dd className="mono text-[0.8125rem]">{d.milestones} milestones</dd>
              </dl>
            </Link>
          ))}
        </Rise>
      </div>
    </section>
  );
}

/* The road as an accordion: one stone open at a time, its body unfolding. */
function Road() {
  const [open, setOpen] = useState(3);
  const bodies = useRef<HTMLDivElement[]>([]);
  const thread = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodies.current.forEach((b, i) => {
      if (!b) return;
      const inner = b.firstElementChild as HTMLElement;
      const h = i === open ? inner.offsetHeight : 0;
      if (stillPreferred()) b.style.height = `${h}px`;
      else gsap.to(b, { height: h, duration: 0.45, ease: "power3.inOut" });
    });
  }, [open]);

  useEffect(() => {
    const el = thread.current;
    if (!el) return;
    if (stillPreferred()) {
      el.dataset.drawn = "true";
      return;
    }
    const watcher = new IntersectionObserver(([e]) => e.isIntersecting && (el.dataset.drawn = "true"), { threshold: 1 });
    watcher.observe(el);
    return () => watcher.disconnect();
  }, []);

  return (
    <section id="road" className="cl-section">
      <div className="wrap-x grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="label">How a file moves</p>
          <Lines as="h2" className="display-face h2 mt-4">
            Six stones on the home-loan road.
          </Lines>
          <p className="muted mt-5 max-w-[38ch]">At each one a named party acts and a paper joins your record. Open a stone to see what happens there.</p>
          <div ref={thread} className="cl-thread mt-8 max-w-[14rem]" aria-hidden="true" />
        </div>
        <ul className="cl-road lg:col-span-8">
          {HOME_LOAN_ROAD.map((m, i) => (
            <li key={m.key}>
              <button type="button" aria-expanded={open === i} aria-controls={`stone-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="stone" aria-hidden="true" />
                <span className="display-face text-[1.375rem] leading-tight sm:text-[1.625rem]">
                  <span className="mono faint mr-3 text-[0.8125rem] font-normal">0{i + 1}</span>
                  {m.title}
                </span>
                <span className="faint hidden text-[0.875rem] sm:block">{m.who === "you" ? "You act" : m.who === "easymarg" ? "EasyMarg acts" : "The lender acts"}</span>
                <ChevronDown className="chev" />
              </button>
              <div
                id={`stone-${i}`}
                ref={(b) => {
                  if (b) bodies.current[i] = b;
                }}
                className="body"
                style={{ height: i === 3 ? "auto" : 0 }}
              >
                <div>
                  <p className="max-w-[52ch] text-[1.0625rem] leading-relaxed">{m.what}</p>
                  <p className="mono mt-3 text-[0.8125rem]">Paper added · {m.paper}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Facts() {
  return (
    <section className="cl-section pt-0">
      <Rise className="wrap-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FACTS.map((f) => (
          <div key={f.label} data-rise className="cl-cushion cl-cushion--deep p-7">
            <p className="display-face text-[5rem] leading-none">
              <Counter value={f.value} />
            </p>
            <p className="mt-5 font-medium">{f.label}</p>
            <p className="muted mt-1 text-sm">{f.note}</p>
          </div>
        ))}
      </Rise>
    </section>
  );
}

function RecordRoom() {
  return (
    <section id="record" className="cl-section pt-0">
      <div className="wrap-x">
        <div className="cl-cushion grid gap-10 p-6 md:p-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label">The record room</p>
            <Lines as="h2" className="display-face h2 mt-4">
              Kept for life.
            </Lines>
            <p className="muted mt-5 max-w-[38ch]">Every paper you give us, and every paper a lender or a bank issues to you, is filed against your name: numbered, dated, checked.</p>
            <ul className="mt-8 space-y-4">
              {RECORD_ROOM.map((r) => (
                <li key={r.title} className="border-t border-[var(--cl-line)] pt-3">
                  <h3 className="font-medium">{r.title}</h3>
                  <p className="muted mt-1 text-[0.9375rem]">{r.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <Rise className="lg:col-span-8">
            <div data-rise>
              <div className="flex flex-wrap items-baseline justify-between gap-3 px-4">
                <p className="font-medium">Register of papers</p>
                <p className="mono faint text-[0.8125rem]">EM/HL/26/00418 · sample</p>
              </div>
              <table className="cl-ledger mt-4">
                <thead>
                  <tr className="label">
                    <th>Ref</th>
                    <th>Paper</th>
                    <th className="hidden sm:table-cell">Filed</th>
                    <th className="text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {REGISTER.map((r) => (
                    <tr key={r.ref}>
                      <td className="mono faint text-[0.8125rem]">{r.ref}</td>
                      <td>{r.paper}</td>
                      <td className="mono muted hidden text-[0.8125rem] whitespace-nowrap sm:table-cell">{r.filed}</td>
                      <td className="text-right">
                        <span className="cl-stamp">{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}

function Refusals() {
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".cl-refusal"));
    if (stillPreferred()) {
      items.forEach((i) => (i.dataset.struck = "true"));
      return;
    }
    const watcher = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && ((e.target as HTMLElement).dataset.struck = "true")),
      { threshold: 0.6 },
    );
    items.forEach((i) => watcher.observe(i));
    return () => watcher.disconnect();
  }, []);
  return (
    <section className="cl-section pt-0">
      <div className="wrap-x grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="label">Our promises</p>
          <Lines as="h2" className="display-face h2 mt-4">
            Four things we will not do.
          </Lines>
          <p className="muted mt-5 max-w-[36ch]">Financial services are sold on a great many promises. Ours are mostly about what does not happen.</p>
        </div>
        <ul ref={list} className="md:col-span-8">
          {REFUSALS.map((r) => (
            <li key={r.title} className="cl-refusal">
              <h3 className="display-face h3">
                <span className="title">{r.title}</span>
              </h3>
              <p className="muted">{r.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="cl-footer">
      <div className="cl-cushion cl-cushion--ink overflow-hidden px-6 pt-14 pb-6 md:px-12 md:pt-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="label">Talk to a person</p>
            <p className="display-face mt-4 text-[clamp(1.75rem,4vw,3.25rem)] leading-tight">
              <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            </p>
            <p className="muted mt-3 text-lg">
              <a href={BRAND.phoneHref}>{BRAND.phone}</a> · {BRAND.city}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-[0.9375rem] md:col-span-5">
            <nav aria-label="Services">
              <p className="label">Services</p>
              <ul className="muted mt-3 space-y-2">
                <li>
                  <Link href="/home-loans">Home loans after a decline</Link>
                </li>
                <li>
                  <Link href="/treasury">Treasury for companies</Link>
                </li>
              </ul>
            </nav>
            <nav aria-label="Your file">
              <p className="label">Your file</p>
              <ul className="muted mt-3 space-y-2">
                <li>
                  <Link href="/login">Customer sign-in</Link>
                </li>
                <li>
                  <Link href="/login?start=file">Start a file</Link>
                </li>
                <li>
                  <Link href="/showcase">Other directions</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <p className="faint mt-12 max-w-[80ch] text-[0.8125rem] leading-relaxed">{BRAND.disclaimer}</p>
        <p className="mono faint mt-3 text-[0.75rem]">© 2026 {BRAND.company} · Reference direction 03 · Clay</p>
        <p className="display-face big mt-10 text-[var(--cl-stone)]" aria-hidden="true">
          EasyMarg
        </p>
      </div>
    </footer>
  );
}

export function ClayView() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <Principles />
        <Desks />
        <Road />
        <Facts />
        <RecordRoom />
        <Refusals />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
