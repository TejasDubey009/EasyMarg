"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface TemplateOption {
  id: string;
  name: string;
  tagline: string;
  href: string;
  badge: string;
  palette: string[];
  typeface: string;
  theme: "blue" | "dark" | "light" | "warm";
  desc: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: "classic",
    name: "Classic EasyMarg",
    tagline: "Live Homepage · Ink & Paper",
    href: "/",
    badge: "Official Live",
    palette: ["#153A9C", "#14171F", "#FFFFFF", "#F6F5F1"],
    typeface: "Archivo · IBM Plex Mono",
    theme: "blue",
    desc: "Clean editorial ink on paper with custom WebGL2 horizon road, interactive milestones, and position sheets.",
  },
  {
    id: "nightline",
    name: "Nightline",
    tagline: "Midnight & Lit Route",
    href: "/showcase/nightline",
    badge: "Dark / 3D Scene",
    palette: ["#06080F", "#11162B", "#5B8CFF", "#F2F2EE"],
    typeface: "Instrument Serif · Geist",
    theme: "dark",
    desc: "Midnight canvas, serif display, single cobalt signal with a full 3D contour terrain fly-through.",
  },
  {
    id: "blueprint",
    name: "Blueprint",
    tagline: "Wireframe & Acid Green",
    href: "/showcase/blueprint",
    badge: "Technical Precision",
    palette: ["#FFFFFF", "#121412", "#8AFC8E", "#D2D3D2"],
    typeface: "Hanken Grotesk · JetBrains Mono",
    theme: "light",
    desc: "White paper, hairlines & dotted grid, light-weight display with 6 assembling wireframe sheets on scroll.",
  },
  {
    id: "clay",
    name: "Clay",
    tagline: "Warm Stone & Milestones",
    href: "/showcase/clay",
    badge: "Warm / Tactile",
    palette: ["#F3EFEB", "#D9D1C7", "#111111", "#FF9900"],
    typeface: "Bricolage Grotesque · DM Sans",
    theme: "warm",
    desc: "Warm stone surfaces, 32px cushion panels, and 6 sculptural 3D matte clay milestones standing on a floor.",
  },
];

const SERVICE_PAGES = [
  {
    title: "Home Loans Desk",
    note: "Home loans after a bank decline",
    href: "/home-loans",
  },
  {
    title: "Treasury Desk",
    note: "Treasury & liquidity for companies",
    href: "/treasury",
  },
];

export function TemplateSwitcher() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"templates" | "services">("templates");
  const panelRef = useRef<HTMLDivElement>(null);

  // Determine current active template
  const currentTemplate = TEMPLATES.find((t) => {
    if (t.href === "/") {
      return pathname === "/" || pathname === "";
    }
    return pathname.startsWith(t.href);
  }) || (pathname === "/showcase" ? { name: "Showcase Hub", badge: "Overview" } : null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close when clicking outside panel
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Keep the public landing pages focused: hide on internal staff desk & customer portal
  if (pathname.startsWith("/portal") || pathname.startsWith("/desk")) {
    return null;
  }

  return (
    <aside aria-label="Template switcher" className="pointer-events-none fixed right-4 bottom-4 z-[99999] font-sans antialiased sm:right-6 sm:bottom-6">
      {/* Floating Launcher Pill */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group pointer-events-auto flex items-center gap-3 rounded-full border border-black/15 bg-white/95 px-4 py-2.5 text-xs font-medium text-neutral-900 shadow-[0_8px_30px_rgb(0,0,0,0.18)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-black/30 hover:bg-white hover:shadow-[0_12px_36px_rgb(0,0,0,0.24)] dark:border-white/20 dark:bg-neutral-900/95 dark:text-white dark:hover:border-white/35 dark:hover:bg-neutral-900"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          title="Choose landing page template"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex size-2.5 rounded-full bg-blue-600"></span>
          </span>

          <span className="flex items-center gap-1.5">
            <span className="font-semibold tracking-tight">Templates</span>
            <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[10px] font-bold text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
              4
            </span>
          </span>

          <span className="hidden text-neutral-400 sm:inline">|</span>

          <span className="hidden max-w-[130px] truncate text-neutral-600 group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-white sm:inline">
            {currentTemplate?.name || "Choose"}
          </span>

          <span className="flex size-5 items-center justify-center rounded-full bg-black/5 transition-transform duration-200 group-hover:bg-black/10 dark:bg-white/10 dark:group-hover:bg-white/20">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 3.5L5 6.5L8 3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      )}

      {/* Expanded Template Selector Modal / Popover */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Choose Landing Page Template"
          className="pointer-events-auto flex max-h-[calc(100dvh-3rem)] w-[min(calc(100vw-2rem),460px)] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/98 text-neutral-900 shadow-[0_24px_64px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition-all duration-200 dark:border-neutral-800 dark:bg-[#0c101d]/98 dark:text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 4h12M2 8h12M2 12h8" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <h2 className="text-sm font-semibold tracking-tight">Landing Page Templates</h2>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Select a visual world to preview
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex size-7 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-black/5 hover:text-neutral-900 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Close template switcher"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M2 2l8 8M10 2L2 10" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-black/5 px-5 pt-2 dark:border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab("templates")}
              className={`relative pb-2.5 text-xs font-medium transition-colors ${
                activeTab === "templates"
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              Hero Directions (4)
              {activeTab === "templates" && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("services")}
              className={`relative ml-5 pb-2.5 text-xs font-medium transition-colors ${
                activeTab === "services"
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              Service Pages (2)
              {activeTab === "services" && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {activeTab === "templates" ? (
              TEMPLATES.map((tmpl, idx) => {
                const isActive =
                  tmpl.href === "/"
                    ? pathname === "/" || pathname === ""
                    : pathname.startsWith(tmpl.href);

                return (
                  <Link
                    key={tmpl.id}
                    href={tmpl.href}
                    onClick={() => setIsOpen(false)}
                    className={`group relative flex flex-col gap-2 rounded-xl border p-3.5 transition-all duration-150 ${
                      isActive
                        ? "border-blue-600 bg-blue-50/50 shadow-xs dark:border-blue-500/80 dark:bg-blue-950/25"
                        : "border-black/5 bg-black/[0.015] hover:border-black/15 hover:bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/20 dark:hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex size-5 items-center justify-center rounded-sm bg-black/5 text-[10px] font-mono font-medium text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
                          0{idx + 1}
                        </span>
                        <h3 className="text-[13px] font-semibold text-neutral-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                          {tmpl.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            isActive
                              ? "bg-blue-600 text-white font-semibold"
                              : "bg-black/5 text-neutral-600 dark:bg-white/10 dark:text-neutral-300"
                          }`}
                        >
                          {isActive ? "Active Now" : tmpl.badge}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11.5px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                      {tmpl.desc}
                    </p>

                    <div className="mt-1 flex items-center justify-between pt-1.5 border-t border-black/5 dark:border-white/5 text-[10.5px]">
                      {/* Swatches */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-400 text-[10px]">Palette:</span>
                        <div className="flex gap-1">
                          {tmpl.palette.map((color) => (
                            <span
                              key={color}
                              className="size-3.5 rounded-xs border border-black/10 dark:border-white/20"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>

                      <span className="font-mono text-neutral-400 truncate max-w-[150px]">
                        {tmpl.typeface.split("·")[0]}
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="space-y-2">
                {SERVICE_PAGES.map((svc) => {
                  const isActive = pathname.startsWith(svc.href);
                  return (
                    <Link
                      key={svc.href}
                      href={svc.href}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center justify-between rounded-xl border p-3.5 transition-all ${
                        isActive
                          ? "border-blue-600 bg-blue-50/50 dark:border-blue-500/80 dark:bg-blue-950/25"
                          : "border-black/5 bg-black/[0.015] hover:border-black/15 hover:bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/20 dark:hover:bg-white/[0.05]"
                      }`}
                    >
                      <div>
                        <h3 className="text-[13px] font-semibold text-neutral-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                          {svc.title}
                        </h3>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {svc.note}
                        </p>
                      </div>
                      <span className="text-neutral-400 group-hover:translate-x-0.5 transition-transform">
                        &rarr;
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with link to full Showcase index */}
          <div className="flex items-center justify-between border-t border-black/5 bg-neutral-50/80 px-4 py-3 text-xs dark:border-white/10 dark:bg-neutral-900/80">
            <Link
              href="/showcase"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              <span>View Full Showcase Spec Hub</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2.5 5h5M5 2.5L7.5 5L5 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <span className="text-[10.5px] text-neutral-400">
              Live on Vercel
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
