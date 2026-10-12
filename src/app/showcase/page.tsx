import Link from "next/link";
import { Wordmark } from "@/components/brand";
import { ArrowRight } from "@/components/ui/icons";

/*
  An index of the three reference directions. Each one is a complete landing
  page for EasyMarg in a different visual world; the live site is untouched.
*/

const DIRECTIONS = [
  {
    href: "/",
    n: "00",
    name: "Classic EasyMarg (Live Home)",
    thesis: "Deep blue and bone paper, Archivo wide display, hairline ink rules. WebGL2 horizon road, interactive milestone explorer, and sample file registers.",
    swatches: ["#153A9C", "#14171F", "#FFFFFF", "#F6F5F1"],
    type: "Archivo · IBM Plex Mono",
    tech: "Hand-written WebGL2, Next.js 16, Tailwind CSS 4",
  },
  {
    href: "/showcase/nightline",
    n: "01",
    name: "Nightline",
    thesis: "Midnight canvas, serif display, one cobalt signal. A fly-through over a contour-line terrain along a lit route.",
    swatches: ["#06080F", "#11162B", "#F2F2EE", "#5B8CFF"],
    type: "Instrument Serif · Geist · Geist Mono",
    tech: "React Three Fiber, GSAP ScrollTrigger, Lenis",
  },
  {
    href: "/showcase/blueprint",
    n: "02",
    name: "Blueprint",
    thesis: "White paper, hairlines and a dotted grid, light-weight display, acid green for highlights only. Six wireframe sheets assemble into a file as you scroll.",
    swatches: ["#FFFFFF", "#121412", "#D2D3D2", "#8AFC8E"],
    type: "Hanken Grotesk · JetBrains Mono",
    tech: "React Three Fiber, GSAP pinned horizontal scroll, SVG stroke draw",
  },
  {
    href: "/showcase/clay",
    n: "03",
    name: "Clay",
    thesis: "Warm stone surfaces, black pill buttons, big cushion panels, bold display. Six matte clay milestones on a floor, with an orange thread for the road.",
    swatches: ["#F3EFEB", "#D9D1C7", "#111111", "#FF9900"],
    type: "Bricolage Grotesque · DM Sans · DM Mono",
    tech: "React Three Fiber with soft contact shadows, GSAP, Lenis",
  },
];

export default function ShowcaseIndex() {
  return (
    <div className="wrap py-14 md:py-20">
      <div className="flex items-center justify-between">
        <Wordmark />
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink">
          &larr; Return to Live Home
        </Link>
      </div>
      <p className="t-label mt-10 text-ink-3">Showcase · 4 landing page directions</p>
      <h1 className="t-h1 mt-3 max-w-[20ch]">Four ways EasyMarg could look.</h1>
      <p className="mt-4 max-w-[58ch] text-ink-2">
        The official live homepage plus three alternative reference directions. Same positioning, same copy, same honesty about what we do and do not do. Four different visual worlds, each built as a complete landing page with its own motion and scene.
      </p>

      <ol className="mt-12 border-t border-ink">
        {DIRECTIONS.map((d) => (
          <li key={d.href} className="border-b border-rule">
            <Link href={d.href} className="group grid gap-x-10 gap-y-4 py-7 transition-[padding] duration-200 ease-out hover:pl-3 md:grid-cols-12 md:items-center">
              <p className="t-data text-ink-3 md:col-span-1">{d.n}</p>
              <div className="md:col-span-6">
                <h2 className="text-[1.625rem] leading-tight font-semibold tracking-[-0.018em] [font-stretch:110%] underline-offset-4 group-hover:underline">
                  {d.name}
                </h2>
                <p className="mt-2 max-w-[52ch] text-ink-2">{d.thesis}</p>
              </div>
              <dl className="text-sm md:col-span-4">
                <div className="flex gap-1.5">
                  {d.swatches.map((c) => (
                    <span key={c} className="size-6 rounded-xs border border-rule-2" style={{ background: c }} title={c} />
                  ))}
                </div>
                <dt className="sr-only">Type</dt>
                <dd className="mt-2 text-ink-2">{d.type}</dd>
                <dt className="sr-only">Built with</dt>
                <dd className="mt-0.5 text-ink-3">{d.tech}</dd>
              </dl>
              <ArrowRight className="hidden text-ink-3 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-ink md:col-span-1 md:block md:justify-self-end" />
            </Link>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-sm text-ink-3">
        These pages run 3D scenes in the browser. They are at their best on a laptop with a pointer, and they respect the system&rsquo;s
        reduced-motion setting.
      </p>
    </div>
  );
}
