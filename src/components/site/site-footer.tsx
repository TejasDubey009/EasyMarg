import Link from "next/link";
import { Mark } from "@/components/brand";
import { ArrowRight, ArrowUp } from "@/components/ui/icons";
import { IndiaClock } from "./india-clock";

const REACH = [
  { href: "mailto:support@easymarg.com", label: "support@easymarg.com", note: "Write to the desk" },
  { href: "tel:+919930919980", label: "+91 99309 19980", note: "Call the desk" },
];

const COLUMNS = [
  {
    title: "Services",
    links: [
      { href: "/home-loans", label: "Home loans after a decline" },
      { href: "/treasury", label: "Treasury for companies" },
      { href: "/#road", label: "How a file moves" },
      { href: "/#record-room", label: "The record room" },
    ],
  },
  {
    title: "Templates",
    links: [
      { href: "/", label: "Classic (Live Home)" },
      { href: "/showcase/nightline", label: "Nightline (Midnight)" },
      { href: "/showcase/blueprint", label: "Blueprint (Wireframe)" },
      { href: "/showcase/clay", label: "Clay (Warm Stone)" },
      { href: "/showcase", label: "Showcase Hub" },
    ],
  },
  {
    title: "Your file",
    links: [
      { href: "/login", label: "Customer sign-in" },
      { href: "/login?as=team", label: "Team sign-in" },
      { href: "/login?start=file", label: "Start a file" },
    ],
  },
];

const hover =
  "relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:ease-out hover:after:scale-x-100";

/*
  The foot of the page is where a document is signed. It asks one thing
  (tell us what you need), gives the two ways to do it, and ends on the name.
*/
export function SiteFooter() {
  return (
    <footer className="on-blue mt-auto overflow-hidden bg-ink text-white">
      <div className="wrap pt-16 md:pt-24">
        <div className="grid gap-x-10 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="t-label text-white/55">Talk to a person</p>
            <h2 className="t-h1 mt-4 max-w-[15ch]">Tell us what you need done.</h2>
            <ul className="mt-9 max-w-[34rem] border-t border-white/20">
              {REACH.map((item) => (
                <li key={item.href} className="border-b border-white/20">
                  <a href={item.href} className="group flex items-center justify-between gap-6 py-4 transition-[padding] duration-200 ease-out hover:pl-2">
                    <span>
                      <span className="t-label block text-white/55">{item.note}</span>
                      <span className="mt-1 block text-[1.25rem] font-medium tracking-[-0.01em] sm:text-[1.5rem]">{item.label}</span>
                    </span>
                    <ArrowRight className="shrink-0 text-white/55 transition-[transform,color] duration-200 ease-out group-hover:translate-x-1 group-hover:text-white" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10 lg:col-span-6 lg:pt-1">
            {COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="t-label text-white/55">{column.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={`text-[0.9375rem] text-white/90 transition-colors duration-150 hover:text-white ${hover}`}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div className="col-span-full border-t border-white/20 pt-5">
              <h2 className="t-label text-white/55">The desk</h2>
              <p className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[0.9375rem] text-white/90">
                <span>Bengaluru, Karnataka, India</span>
                <span className="text-white/70">
                  <IndiaClock />
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-4 border-t border-white/20 pt-6 text-[0.8125rem] leading-relaxed text-white/55 md:mt-20 md:grid-cols-12">
          <p className="md:col-span-6">
            EasyMarg prepares and represents your case; it does not lend, and it never holds or moves your money. Every loan and every limit is
            sanctioned at the sole discretion of the lending institution. Nothing on this site is a promise of credit.
          </p>
          <p className="md:col-span-4 md:pl-6">© 2026 GetProTech Solutions Private Limited</p>
          <p className="md:col-span-2 md:text-right">
            <a href="#" className={`inline-flex items-center gap-1.5 text-white/90 transition-colors duration-150 hover:text-white ${hover}`}>
              Back to top
              <ArrowUp />
            </a>
          </p>
        </div>
      </div>

      {/* The name, set as wide as the page. */}
      <div className="wrap mt-10 pb-6 [container-type:inline-size] md:mt-14" aria-hidden="true">
        <p className="flex items-end justify-between gap-[2cqw] text-blue select-none">
          <Mark tone="current" className="mb-[2.5cqw] h-auto w-[7cqw] shrink-0" />
          <span className="block text-[17.3cqw] leading-[0.86] font-semibold tracking-[-0.045em] whitespace-nowrap [font-stretch:118%]">
            EasyMarg
          </span>
        </p>
        <p className="t-label mt-5 flex flex-wrap justify-between gap-x-6 gap-y-1 text-white/55">
          <span>
            Marg ·{" "}
            <span lang="hi" className="font-deva text-[0.8125rem] tracking-normal">
              मार्ग
            </span>{" "}
            · a road; a way through
          </span>
          <span>Financial services</span>
        </p>
      </div>
    </footer>
  );
}
