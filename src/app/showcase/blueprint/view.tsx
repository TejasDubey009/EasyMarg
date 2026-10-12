"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Mark } from "@/components/brand";
import { ArrowRight } from "@/components/ui/icons";
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
    <header className="bp-nav">
      <Link href="/showcase/blueprint" aria-label="EasyMarg, Blueprint" className="flex items-center gap-2.5">
        <Mark tone="current" />
        <span className="text-[1.125rem] font-medium tracking-[-0.02em]">EasyMarg</span>
      </Link>
      <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
        <a href="#desks">Services</a>
        <a href="#road">How it works</a>
        <a href="#record">Record room</a>
      </nav>
      <div className="flex items-center gap-3">
        <Link
          href="/showcase"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xs border border-ink/20 px-2.5 py-1 text-xs text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <span>Templates</span>
          <span className="font-mono text-[10px] opacity-70">(4)</span>
        </Link>
        <Link href="/" className="hidden lg:inline text-xs text-ink/60 transition-colors hover:text-ink">
          Home
        </Link>
        <Link href="/login" className="hidden sm:inline">
          Sign in
        </Link>
        <Link href="/login?start=file" className="bp-btn bp-btn--sm">
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
  const [stacked, setStacked] = useState(false);

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
        setStacked(self.progress > 0.82);
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={stage} className="bp-stage grid-paper">
      <div className="bp-sticky">
        <Scene progress={progress} pointer={pointer} />
        <div className="bp-sheetcount" aria-live="polite">
          <p className="label">Sheet count</p>
          <p className="n">{stacked ? "1" : "6"}</p>
          <p className="mono text-[0.8125rem]">{stacked ? "file, numbered" : "sheets, loose"}</p>
        </div>
        <div className="bp-hero wrap-x">
          <div className="max-w-[40rem]">
            <p className="label">{BRAND.meaning}</p>
            <Lines as="h1" className="display mt-5" delay={0.2}>
              Financial services, drawn to plan.
            </Lines>
            <Lines as="p" className="lede mt-7 max-w-[44ch]" delay={0.6} stagger={0.05}>
              A named officer, a numbered file and a record that outlives the work. EasyMarg is one destination for the finance that people and companies find hardest to get done.
            </Lines>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <Link href="/login?start=file" className="bp-btn">
                  Start a file
                  <ArrowRight className="arrow" />
                </Link>
              </Magnetic>
              <Magnetic>
                <a href="#desks" className="bp-btn bp-btn--ghost">
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

function Index() {
  return (
    <section className="bp-section">
      <div className="wrap-x">
        <div className="grid gap-8 md:grid-cols-12">
          <p className="label md:col-span-3">Index · what holds for every service</p>
          <Lines as="h2" className="h2 md:col-span-9" >
            One destination. Every service runs the same way.
          </Lines>
        </div>
        <Rise as="ul" className="bp-index mt-12">
          {PRINCIPLES.map((p) => (
            <li key={p.n} data-rise>
              <span className="num">{p.n}</span>
              <h3 className="h3">{p.title}</h3>
              <p className="muted">{p.body}</p>
            </li>
          ))}
        </Rise>
      </div>
    </section>
  );
}

function Desks() {
  return (
    <section id="desks" className="bp-section">
      <div className="wrap-x">
        <div className="grid gap-8 md:grid-cols-12">
          <p className="label md:col-span-3">Two desks are open</p>
          <p className="lede max-w-[52ch] md:col-span-9">
            We open one desk at a time, and only once we can run it properly. These are the two you can walk into today.
          </p>
        </div>
        <Rise className="bp-desks mt-12">
          {DESKS.map((d) => (
            <Link key={d.href} href={d.href} data-rise>
              <p className="label">{d.audience}</p>
              <h3 className="h2 mt-4">
                <span className="title">{d.title}</span>
              </h3>
              <p className="muted mt-5 max-w-[46ch]">{d.body}</p>
              <dl className="mt-8 grid gap-x-6 gap-y-3 text-[0.9375rem] sm:grid-cols-[7rem_1fr]">
                <dt className="faint">Who it is for</dt>
                <dd>{d.who}</dd>
                <dt className="faint">What you get</dt>
                <dd>{d.get}</dd>
                <dt className="faint">Road</dt>
                <dd className="mono text-[0.8125rem]">{d.milestones} milestones</dd>
              </dl>
              <p className="go mt-8">
                Open the sheet <ArrowRight />
              </p>
            </Link>
          ))}
        </Rise>
      </div>
    </section>
  );
}

/* The road runs sideways: the section pins while six panels slide past, and the route line is drawn as they go. */
function Road() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const sec = section.current;
    const tr = track.current;
    if (!sec || !tr) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      // every panel with a stone on it; the trailing spacer has none
      const panels = (Array.from(tr.children) as HTMLElement[]).filter((pl) => pl.querySelector(".stone"));
      const draw = () => {
        const p = path.current;
        const s = svg.current;
        if (!p || !s) return 0;
        const h = tr.getBoundingClientRect().height;
        s.setAttribute("width", String(tr.scrollWidth));
        s.setAttribute("viewBox", `0 0 ${tr.scrollWidth} ${h}`);
        const stones = panels.map((pl) => {
          const st = pl.querySelector<HTMLElement>(".stone")!;
          return { x: pl.offsetLeft + st.offsetLeft + st.offsetWidth / 2, y: st.offsetTop + st.offsetHeight / 2 };
        });
        let d = `M ${-40} ${stones[0].y}`;
        stones.forEach((s1, i) => {
          const prev = i === 0 ? { x: -40, y: s1.y } : stones[i - 1];
          const cx = (prev.x + s1.x) / 2;
          d += ` C ${cx} ${prev.y - 48}, ${cx} ${s1.y + 48}, ${s1.x} ${s1.y}`;
        });
        p.setAttribute("d", d);
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}`;
        return len;
      };
      let len = draw();
      const distance = () => tr.scrollWidth - window.innerWidth;
      // The line is drawn as far as the reader can see: a little past the right edge of the viewport.
      const ink = (p: number) => {
        const el = path.current;
        if (!el) return;
        const seen = (p * distance() + window.innerWidth * 0.95) / tr.scrollWidth;
        el.style.strokeDashoffset = `${len * (1 - Math.min(1, seen))}`;
      };
      const tween = gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            len = draw();
            ink(self.progress);
          },
          onUpdate: (self) => ink(self.progress),
        },
      });
      ink(0);
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="road" ref={section} className="bp-road">
      <div className="bp-road-head wrap-x grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="label">How a file moves</p>
          <h2 className="h2 mt-4">Six stones on the home-loan road.</h2>
        </div>
        <p className="muted max-w-[42ch] md:col-span-5">
          At each stone a named party acts and a paper joins your record. The file always shows which stone it is standing at.
        </p>
      </div>
      <div ref={track} className="bp-track">
        <svg ref={svg} className="bp-route" aria-hidden="true">
          <path ref={path} d="M 0 0" />
        </svg>
        {HOME_LOAN_ROAD.map((m, i) => (
          <article key={m.key} className="bp-panel">
            <span className="stone" aria-hidden="true" />
            <p className="num">{i + 1}</p>
            <p className="label mt-6">{m.who === "you" ? "You act" : m.who === "easymarg" ? "EasyMarg acts" : "The lender acts"}</p>
            <h3 className="h3 mt-2">{m.title}</h3>
            <p className="muted mt-3 max-w-[36ch]">{m.what}</p>
            <p className="mono mt-5 text-[0.8125rem]">Paper added · {m.paper}</p>
          </article>
        ))}
        <div className="bp-panel hidden md:block" aria-hidden="true" />
      </div>
    </section>
  );
}

function Refusals() {
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".bp-refusal"));
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
    <section className="bp-section bp-section--green">
      <div className="wrap-x grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="label">Our promises</p>
          <Lines as="h2" className="h2 mt-4">
            Four things we will not do.
          </Lines>
          <p className="muted mt-5 max-w-[36ch]">Financial services are sold on a great many promises. Ours are mostly about what does not happen.</p>
        </div>
        <ul ref={list} className="md:col-span-8">
          {REFUSALS.map((r) => (
            <li key={r.title} className="bp-refusal">
              <h3 className="h3">
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

function RecordRoom() {
  const years = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const year = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = years.current;
    if (!el || stillPreferred()) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      end: "top 30%",
      scrub: 0.5,
      onUpdate: (self) => {
        if (marker.current) marker.current.style.left = `${self.progress * 100}%`;
        if (year.current) year.current.textContent = String(2026 + Math.round(self.progress * 30));
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section id="record" className="bp-section grid-paper">
      <div className="wrap-x grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="label">The record room</p>
          <Lines as="h2" className="h2 mt-4">
            Kept for life.
          </Lines>
          <p className="muted mt-5 max-w-[40ch]">Every paper you give us, and every paper a lender or a bank issues to you, is filed against your name: numbered, dated, checked.</p>
          <ul className="mt-8 space-y-4">
            {RECORD_ROOM.map((r) => (
              <li key={r.title} className="border-t border-[var(--bp-line)] pt-3">
                <h3 className="font-medium">{r.title}</h3>
                <p className="muted mt-1 text-[0.9375rem]">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <Rise className="border border-[var(--bp-line)] bg-white p-6 lg:col-span-8 lg:p-8">
          <div data-rise>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-medium">Register of papers</p>
              <p className="mono faint text-[0.8125rem]">EM/HL/26/00418 · sample · as it stands in <span ref={year}>2026</span></p>
            </div>
            <table className="bp-ledger mt-5">
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
                    <td className="mono faint pr-4 text-[0.8125rem]">{r.ref}</td>
                    <td className="pr-4">{r.paper}</td>
                    <td className="mono muted hidden pr-4 text-[0.8125rem] whitespace-nowrap sm:table-cell">{r.filed}</td>
                    <td className="text-right">
                      <span className="bp-stamp">{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="label mt-10">The same six papers, at every year on this rule</p>
            <div ref={years} className="bp-years mt-3">
              {[2026, 2036, 2046, 2056].map((y, i) => (
                <span key={y} className="tick mono text-[0.75rem]" style={{ left: `${(i / 3) * 100}%` }}>
                  {y}
                </span>
              ))}
              <span ref={marker} className="marker" aria-hidden="true" />
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
}

function Facts() {
  return (
    <section className="bp-section">
      <Rise className="wrap-x grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {FACTS.map((f) => (
          <div key={f.label} data-rise className="border-t border-[var(--bp-line-2)] pt-5">
            <p className="text-[4.5rem] leading-none font-extralight tracking-[-0.05em]">
              <Counter value={f.value} />
            </p>
            <p className="mt-3">{f.label}</p>
            <p className="faint mt-1 text-sm">{f.note}</p>
          </div>
        ))}
      </Rise>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bp-footer">
      <div className="wrap-x">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="label">Talk to a person</p>
            <p className="h2 mt-4">
              <a href={`mailto:${BRAND.email}`} className="underline decoration-[var(--bp-line)] decoration-1 underline-offset-8 hover:decoration-[var(--bp-ink)]">
                {BRAND.email}
              </a>
            </p>
            <p className="muted mt-4">
              <a href={BRAND.phoneHref}>{BRAND.phone}</a> · {BRAND.city}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-[0.9375rem] md:col-span-6">
            <nav aria-label="Services">
              <p className="label">Services</p>
              <ul className="mt-3 space-y-2">
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
              <ul className="mt-3 space-y-2">
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
        <p className="faint mt-12 max-w-[80ch] border-t border-[var(--bp-line)] pt-6 text-[0.8125rem] leading-relaxed">{BRAND.disclaimer}</p>
        <p className="mono faint mt-3 text-[0.75rem]">© 2026 {BRAND.company} · Reference direction 02 · Blueprint</p>
        <p className="outline mt-10" aria-hidden="true">
          EasyMarg
        </p>
      </div>
    </footer>
  );
}

export function BlueprintView() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <Index />
        <Desks />
        <Road />
        <Refusals />
        <RecordRoom />
        <Facts />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
