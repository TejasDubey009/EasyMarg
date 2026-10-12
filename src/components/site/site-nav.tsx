"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";
import { ChevronDown, Close, Menu } from "@/components/ui/icons";

const SERVICES = [
  { href: "/home-loans", audience: "For individuals", title: "Home loans after a decline", note: "A file a lender will read in full." },
  { href: "/treasury", audience: "For companies", title: "Treasury for growing companies", note: "A treasury desk, without the department." },
];

const TEMPLATES = [
  { href: "/", tag: "00", title: "Classic EasyMarg", note: "Ink on paper · WebGL horizon road" },
  { href: "/showcase/nightline", tag: "01", title: "Nightline", note: "Midnight canvas · 3D lit route" },
  { href: "/showcase/blueprint", tag: "02", title: "Blueprint", note: "Technical grid · 6 assembling sheets" },
  { href: "/showcase/clay", tag: "03", title: "Clay", note: "Warm stone · 3D clay milestones" },
  { href: "/showcase", tag: "All", title: "Showcase Hub", note: "Compare all reference directions" },
];

const LINKS = [
  { href: "/#road", label: "How it works" },
  { href: "/#record-room", label: "Record room" },
];

/**
 * The bar stays with you as you scroll. `tone="blue"` is for a page that opens
 * on the brand block: the bar is part of that block until the block has scrolled
 * away, then it turns to paper like everywhere else.
 */
export function SiteNav({ tone = "white" }: { tone?: "blue" | "white" }) {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [past, setPast] = useState(false);
  const closing = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const templatesClosing = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (tone !== "blue") return;
    const mark = document.querySelector("[data-nav-flip]");
    if (!mark) return;
    const watcher = new IntersectionObserver(([entry]) => setPast(!entry.isIntersecting && entry.boundingClientRect.top < 100), {
      rootMargin: "-72px 0px 0px 0px",
    });
    watcher.observe(mark);
    return () => watcher.disconnect();
  }, [tone]);

  const blue = tone === "blue" && !past;
  const link = `relative text-[0.9375rem] font-medium transition-colors duration-150 after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:ease-out hover:after:scale-x-100 ${
    blue ? "text-white/90 hover:text-white" : "text-ink-2 hover:text-ink"
  }`;

  const openServices = () => {
    clearTimeout(closing.current);
    setServices(true);
  };
  const closeServices = () => {
    clearTimeout(closing.current);
    closing.current = setTimeout(() => setServices(false), 120);
  };

  const openTemplates = () => {
    clearTimeout(templatesClosing.current);
    setTemplatesOpen(true);
  };
  const closeTemplates = () => {
    clearTimeout(templatesClosing.current);
    templatesClosing.current = setTimeout(() => setTemplatesOpen(false), 120);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ease-out ${
        blue ? "on-blue border-b border-transparent bg-blue text-white" : "border-b border-rule bg-white text-ink"
      }`}
    >
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-6">
        <Wordmark tone={blue ? "white" : "ink"} />

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {/* Templates Dropdown */}
          <div
            className="relative"
            onMouseEnter={openTemplates}
            onMouseLeave={closeTemplates}
            onKeyDown={(event) => event.key === "Escape" && setTemplatesOpen(false)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setTemplatesOpen(false);
            }}
          >
            <button
              type="button"
              aria-expanded={templatesOpen}
              aria-controls="templates-menu"
              onClick={() => setTemplatesOpen((value) => !value)}
              className={`inline-flex items-center gap-1.5 ${link} after:hidden`}
            >
              <span>Templates</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono font-bold ${blue ? "bg-white/20 text-white" : "bg-blue-wash text-blue"}`}>
                4
              </span>
              <ChevronDown className={`transition-transform duration-200 ease-out ${templatesOpen ? "rotate-180" : ""}`} />
            </button>
            <div
              id="templates-menu"
              className={`absolute top-full -left-5 pt-4 transition-[opacity,transform,visibility] duration-200 ease-out ${
                templatesOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
              }`}
            >
              <div className="w-[24rem] rounded-sm border border-ink bg-white p-1.5 text-ink shadow-xl">
                <ul>
                  {TEMPLATES.map((tmpl) => (
                    <li key={tmpl.href}>
                      <Link
                        href={tmpl.href}
                        onClick={() => setTemplatesOpen(false)}
                        className="group flex items-start gap-3 rounded-xs px-3.5 py-2.5 transition-colors duration-150 hover:bg-paper"
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-xs bg-ink/5 font-mono text-[10px] font-medium text-ink-3">
                          {tmpl.tag}
                        </span>
                        <div>
                          <span className="block font-semibold text-ink underline-offset-4 group-hover:underline">{tmpl.title}</span>
                          <span className="mt-0.5 block text-xs text-ink-2">{tmpl.note}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={openServices}
            onMouseLeave={closeServices}
            onKeyDown={(event) => event.key === "Escape" && setServices(false)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setServices(false);
            }}
          >
            <button
              type="button"
              aria-expanded={services}
              aria-controls="services-menu"
              onClick={() => setServices((value) => !value)}
              className={`inline-flex items-center gap-1.5 ${link} after:hidden`}
            >
              Services
              <ChevronDown className={`transition-transform duration-200 ease-out ${services ? "rotate-180" : ""}`} />
            </button>
            <div
              id="services-menu"
              className={`absolute top-full -left-5 pt-4 transition-[opacity,transform,visibility] duration-200 ease-out ${
                services ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
              }`}
            >
              <div className="w-[23rem] rounded-sm border border-ink bg-white p-1.5 text-ink shadow-xl">
                <ul>
                  {SERVICES.map((service) => (
                    <li key={service.href}>
                      <Link
                        href={service.href}
                        onClick={() => setServices(false)}
                        className="group block rounded-xs px-3.5 py-3 transition-colors duration-150 hover:bg-paper"
                      >
                        <span className="t-label text-blue">{service.audience}</span>
                        <span className="mt-1 block font-semibold underline-offset-4 group-hover:underline">{service.title}</span>
                        <span className="mt-0.5 block text-sm text-ink-2">{service.note}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-1 border-t border-rule px-3.5 pt-3 pb-2 text-sm text-ink-3">More desks will open here, one at a time.</p>
              </div>
            </div>
          </div>

          {LINKS.map((item) => (
            <Link key={item.href} href={item.href} className={link}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className={`hidden h-9 items-center rounded-md px-3 text-[0.9375rem] font-medium transition-colors duration-150 sm:inline-flex ${
              blue ? "text-white hover:bg-white/10" : "text-ink hover:bg-paper"
            }`}
          >
            Sign in
          </Link>
          <ButtonLink href="/login?start=file" size="sm" variant={blue ? "on-blue" : "primary"}>
            Start a file
          </ButtonLink>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
            className={`inline-flex size-10 items-center justify-center rounded-md transition-colors duration-150 lg:hidden ${blue ? "hover:bg-white/10" : "hover:bg-paper"}`}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="site-menu" aria-label="Main" className={`settle lg:hidden ${blue ? "border-t border-white/20" : "border-t border-rule"}`}>
          <div className="wrap py-3 space-y-4">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${blue ? "text-white/60" : "text-ink-3"}`}>
                Templates &amp; Directions
              </p>
              <ul className="mt-2 space-y-1">
                {TEMPLATES.map((tmpl) => (
                  <li key={tmpl.href}>
                    <Link
                      href={tmpl.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between py-2 text-sm font-medium ${blue ? "text-white hover:text-blue-tint" : "text-ink hover:text-blue"}`}
                    >
                      <span>{tmpl.title}</span>
                      <span className="text-xs opacity-60 font-mono">{tmpl.tag}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`border-t pt-3 ${blue ? "border-white/15" : "border-rule"}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider ${blue ? "text-white/60" : "text-ink-3"}`}>
                Services
              </p>
              <ul className="mt-2 space-y-1">
                {SERVICES.map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      onClick={() => setOpen(false)}
                      className={`block py-1.5 text-sm font-medium ${blue ? "text-white" : "text-ink"}`}
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`border-t pt-3 ${blue ? "border-white/15" : "border-rule"}`}>
              <ul className="space-y-1">
                {[...LINKS, { href: "/login", label: "Sign in" }].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block py-1.5 text-sm font-medium ${blue ? "text-white" : "text-ink"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
