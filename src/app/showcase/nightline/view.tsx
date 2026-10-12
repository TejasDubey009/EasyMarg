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
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className="nl-nav" data-scrolled={scrolled}>
      <Link href="/showcase/nightline" aria-label="EasyMarg, Nightline" className="flex items-center gap-2.5 !text-[var(--nl-text)]">
        <Mark tone="white" />
        <span className="serif text-[1.35rem]">EasyMarg</span>
      </Link>
      <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
        <a href="#desks">Services</a>
        <a href="#road">How it works</a>
        <a href="#record">Record room</a>
      </nav>
      <div className="flex items-center gap-3">
        <Link
          href="/showcase"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-xs text-white/80 transition-colors hover:bg-white/15 hover:text-white"
        >
          <span>Templates</span>
          <span className="font-mono text-[10px] opacity-70">(4)</span>
        </Link>
        <Link href="/" className="hidden lg:inline text-xs text-white/60 transition-colors hover:text-white">
          Home
        </Link>
        <Link href="/login" className="hidden sm:inline">
          Sign in
        </Link>
        <Link href="/login?start=file" className="nl-btn nl-btn--sm">
          Start a file
        </Link>
      </div>
    </header>
  );
}

/* The hero and the six-stop story share one pinned stage and one scroll progress. */
function Stage() {
  const stage = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const captions = useRef<HTMLDivElement[]>([]);
  const progress = useRef(0);
  const pointer = usePointer();

  useEffect(() => {
    const el = stage.current;
    if (!el || stillPreferred()) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          if (bar.current) bar.current.style.transform = `scaleY(${Math.max(0, (self.progress - 0.1) / 0.9)})`;
        },
      });
      // the hero gives way as the journey begins
      gsap.to(hero.current, {
        autoAlpha: 0,
        y: -40,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "12% top", scrub: true },
      });
      // six captions, each with its own window of the road
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "10% top", end: "bottom bottom", scrub: 0.4 } });
      // ten units of road per stone; the last stone stays in view to the end
      captions.current.forEach((c, i) => {
        const at = i * 10;
        tl.fromTo(c, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 2.6, ease: "power2.out" }, at + 0.6);
        if (i < captions.current.length - 1) tl.to(c, { autoAlpha: 0, y: -22, duration: 2, ease: "power2.in" }, at + 7.4);
      });
      tl.to({}, { duration: 0.1 }, 59.9);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={stage} className="nl-stage">
      <div className="nl-sticky">
        <Scene progress={progress} pointer={pointer} />
        <div className="nl-vignette" />

        <div ref={hero} className="nl-hero wrap-x">
          <p className="label !text-[var(--nl-text-2)]">{BRAND.meaning}</p>
          <Lines as="h1" className="serif display mt-5 max-w-[12ch]" delay={0.2}>
            The road through, lit from end to end.
          </Lines>
          <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-end">
            <Lines as="p" className="lede max-w-[46ch] md:col-span-7" delay={0.7} stagger={0.06}>
              EasyMarg carries the financial work that people and companies find hardest to get done. One case officer from the first paper to the last, and every document kept on your record for life.
            </Lines>
            <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
              <Magnetic>
                <Link href="/login?start=file" className="nl-btn">
                  Start a file
                  <ArrowRight className="arrow" />
                </Link>
              </Magnetic>
              <Magnetic>
                <a href="#desks" className="nl-btn nl-btn--ghost">
                  See what we do
                </a>
              </Magnetic>
            </div>
          </div>
          <p className="label mt-10 hidden md:block">Scroll to travel the road</p>
        </div>

        {HOME_LOAN_ROAD.map((m, i) => (
          <div
            key={m.key}
            ref={(c) => {
              if (c) captions.current[i] = c;
            }}
            className="nl-caption"
            aria-hidden="true"
          >
            <p className="n">{i + 1}</p>
            <p className="label mt-4">
              Milestone {i + 1} of {HOME_LOAN_ROAD.length} · {m.who === "you" ? "You act" : m.who === "easymarg" ? "EasyMarg acts" : "The lender acts"}
            </p>
            <h2 className="serif h3 mt-2">{m.title}</h2>
            <p className="muted mt-3 max-w-[40ch]">{m.what}</p>
            <p className="mono mt-4 text-[0.8125rem] text-[var(--nl-signal)]">Paper added · {m.paper}</p>
          </div>
        ))}

        <div className="nl-progress" aria-hidden="true">
          <span className="label">Home-loan road</span>
          <span className="bar">
            <i ref={bar} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* Only one road is shown in the scene; the stops are listed in words for everyone, including readers of the still version. */
function RoadList() {
  return (
    <section id="road" className="nl-section">
      <div className="wrap-x grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="label">How a file moves</p>
          <Lines as="h2" className="serif h2 mt-4">
            Six stones on the home-loan road.
          </Lines>
          <p className="muted mt-5 max-w-[40ch]">At each one a named party has to act, and a paper joins your record. Your file always shows which stone it is standing at.</p>
        </div>
        <Rise as="ul" className="md:col-span-8">
          {HOME_LOAN_ROAD.map((m, i) => (
            <li key={m.key} data-rise className="grid gap-x-6 gap-y-2 border-t border-[var(--nl-line)] py-5 last:border-b sm:grid-cols-[3rem_1fr_11rem]">
              <span className="serif text-[1.75rem] leading-none text-[var(--nl-signal)]">{i + 1}</span>
              <div>
                <h3 className="text-[1.125rem] font-medium">{m.title}</h3>
                <p className="muted mt-1 text-[0.9375rem]">{m.what}</p>
              </div>
              <p className="mono faint text-[0.8125rem] sm:text-right">{m.paper}</p>
            </li>
          ))}
        </Rise>
      </div>
    </section>
  );
}

function Desks() {
  return (
    <section id="desks" className="nl-section nl-section--panel">
      <div className="wrap-x">
        <p className="label">Two desks are open</p>
        <Lines as="h2" className="serif h2 mt-4 max-w-[18ch]">
          One destination. Every service runs the same way.
        </Lines>
        <Rise className="mt-12">
          {DESKS.map((d) => (
            <Link key={d.href} href={d.href} data-rise className="nl-row group">
              <p className="label pt-1">{d.audience}</p>
              <div>
                <h3 className="serif h3 title">{d.title}</h3>
                <p className="muted mt-3 max-w-[44ch]">{d.body}</p>
              </div>
              <dl className="text-[0.9375rem]">
                <dt className="faint">Who it is for</dt>
                <dd className="mt-1">{d.who}</dd>
                <dt className="faint mt-4">Road</dt>
                <dd className="mono mt-1 text-[0.8125rem]">{d.milestones} milestones</dd>
              </dl>
              <span className="go" aria-hidden="true">
                <ArrowRight className="transition-transform duration-200" />
              </span>
            </Link>
          ))}
        </Rise>
      </div>
    </section>
  );
}

function GlowPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={["nl-glow", className].filter(Boolean).join(" ")}
      onPointerMove={(event) => {
        const r = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--mx", `${event.clientX - r.left}px`);
        event.currentTarget.style.setProperty("--my", `${event.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}

function Principles() {
  return (
    <section className="nl-section">
      <div className="wrap-x">
        <Rise className="grid gap-5 md:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <GlowPanel key={p.n} className="p-7 md:p-8" >
              <div data-rise>
                <p className="mono faint text-[0.8125rem]">{p.n}</p>
                <h3 className="serif h3 mt-8">{p.title}</h3>
                <p className="muted mt-3">{p.body}</p>
              </div>
            </GlowPanel>
          ))}
        </Rise>
        <Rise className="mt-16 grid gap-x-8 gap-y-10 border-t border-[var(--nl-line)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.label} data-rise>
              <p className="serif text-[4rem] leading-none">
                <Counter value={f.value} />
              </p>
              <p className="mt-3">{f.label}</p>
              <p className="faint mt-1 text-sm">{f.note}</p>
            </div>
          ))}
        </Rise>
      </div>
    </section>
  );
}

function RecordRoom() {
  return (
    <section id="record" className="nl-section nl-section--panel">
      <div className="wrap-x grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="label">The record room</p>
          <Lines as="h2" className="serif h2 mt-4">
            Kept for life.
          </Lines>
          <p className="muted mt-5 max-w-[40ch]">Every paper you give us, and every paper a lender or a bank issues to you, is filed against your name: numbered, dated, checked.</p>
          <ul className="mt-8 space-y-5">
            {RECORD_ROOM.map((r) => (
              <li key={r.title} className="border-t border-[var(--nl-line)] pt-4">
                <h3 className="font-medium">{r.title}</h3>
                <p className="muted mt-1 text-[0.9375rem]">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <Rise className="lg:col-span-8">
          <GlowPanel className="p-6 md:p-8">
            <div data-rise>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="font-medium">Register of papers</p>
                <p className="mono faint text-[0.8125rem]">EM/HL/26/00418 · sample</p>
              </div>
              <table className="nl-ledger mt-5">
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
                        <span className="nl-stamp">
                          <i />
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlowPanel>
        </Rise>
      </div>
    </section>
  );
}

function Refusals() {
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".nl-refusal"));
    if (stillPreferred()) {
      items.forEach((i) => (i.dataset.struck = "true"));
      return;
    }
    const watcher = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) (entry.target as HTMLElement).dataset.struck = "true";
        }),
      { threshold: 0.6 },
    );
    items.forEach((i) => watcher.observe(i));
    return () => watcher.disconnect();
  }, []);
  return (
    <section className="nl-section">
      <div className="wrap-x grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="label">Our promises</p>
          <Lines as="h2" className="serif h2 mt-4">
            Four things we will not do.
          </Lines>
          <p className="muted mt-5 max-w-[36ch]">Financial services are sold on a great many promises. Ours are mostly about what does not happen.</p>
        </div>
        <ul ref={ref} className="md:col-span-8">
          {REFUSALS.map((r) => (
            <li key={r.title} className="nl-refusal">
              <h3 className="serif h3">
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
    <footer className="nl-footer">
      <div className="wrap-x">
        <p className="label">Talk to a person</p>
        <p className="big mt-4">
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
        </p>
        <p className="muted mt-3 text-lg">
          <a href={BRAND.phoneHref}>{BRAND.phone}</a> · {BRAND.city}
        </p>
        <div className="mt-14 grid gap-8 border-t border-[var(--nl-line)] pt-8 text-sm md:grid-cols-12">
          <div className="flex flex-wrap gap-x-8 gap-y-2 md:col-span-5">
            <Link href="/home-loans" className="muted">
              Home loans
            </Link>
            <Link href="/treasury" className="muted">
              Treasury
            </Link>
            <Link href="/login" className="muted">
              Sign in
            </Link>
            <Link href="/showcase" className="muted">
              Other directions
            </Link>
          </div>
          <p className="faint md:col-span-7">{BRAND.disclaimer}</p>
        </div>
        <p className="faint mt-8 text-sm">
          © 2026 {BRAND.company} · Reference direction 01 · Nightline
        </p>
      </div>
    </footer>
  );
}

export function NightlineView() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Stage />
        <RoadList />
        <Desks />
        <Principles />
        <RecordRoom />
        <Refusals />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
