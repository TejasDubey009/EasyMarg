"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Wordmark } from "@/components/brand";
import { Stamp } from "@/components/ui/stamp";
import { onNotify } from "@/lib/notify";
import { demo, useDemo, useHydrated } from "@/lib/store";

type Area = "customer" | "staff";

const NAV: Record<Area, { href: string; label: string; exact?: boolean }[]> = {
  customer: [
    { href: "/portal", label: "Overview", exact: true },
    { href: "/portal/documents", label: "Record room" },
    { href: "/portal/apply", label: "New application" },
  ],
  staff: [
    { href: "/desk", label: "Queue", exact: true },
    { href: "/desk/archive", label: "Archive" },
  ],
};

const HOME: Record<Area, string> = { customer: "/portal", staff: "/desk" };

function NavLinks({ area, pathname }: { area: Area; pathname?: string }) {
  return (
    <ul className="flex h-full items-stretch gap-6">
      {NAV[area].map((item) => {
        const here = pathname !== undefined && (item.exact ? pathname === item.href || pathname.startsWith(`${item.href}/files`) : pathname.startsWith(item.href));
        return (
          <li key={item.href} className="flex">
            <Link
              href={item.href}
              aria-current={here ? "page" : undefined}
              className={`-mb-px flex items-center border-b-2 text-[0.9375rem] font-medium whitespace-nowrap transition-colors ${
                here ? "border-blue text-blue" : "border-transparent text-ink-2 hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* The current path is only known at request time on file pages, so it is read inside a Suspense boundary. */
function ActiveNavLinks({ area }: { area: Area }) {
  const pathname = usePathname();
  return <NavLinks area={area} pathname={pathname} />;
}

function Toaster() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const off = onNotify((next) => {
      setMessage(next);
      clearTimeout(timer);
      timer = setTimeout(() => setMessage(null), 5000);
    });
    return () => {
      off();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-5">
      {message && (
        <p className="pointer-events-auto max-w-md rounded-sm bg-ink px-4 py-3 text-sm leading-snug text-white">{message}</p>
      )}
    </div>
  );
}

export function AppShell({ area, children }: { area: Area; children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const { session, clients } = useDemo();

  const allowed = session?.role === (area === "customer" ? "customer" : "staff");

  useEffect(() => {
    if (hydrated && !allowed) router.replace(area === "staff" ? "/login?as=team" : "/login");
  }, [hydrated, allowed, area, router]);

  const who =
    session?.role === "customer" ? clients.find((c) => c.id === session.clientId)?.name : session?.role === "staff" ? session.name : undefined;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-rule bg-white">
        <div className="wrap flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Wordmark href={HOME[area]} />
            {area === "staff" && <Stamp tone="blue">Desk</Stamp>}
          </div>
          <nav aria-label="Sections" className="hidden h-full flex-1 pl-6 md:block">
            <Suspense fallback={<NavLinks area={area} />}>
              <ActiveNavLinks area={area} />
            </Suspense>
          </nav>
          <div className="flex items-center gap-4">
            {who && <span className="hidden max-w-[16rem] truncate text-sm text-ink-2 sm:block">{who}</span>}
            <button
              type="button"
              onClick={() => {
                demo.signOut();
                router.push("/login");
              }}
              className="h-9 rounded-md border border-rule-2 px-3 text-sm font-medium text-ink transition-colors hover:border-ink"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav aria-label="Sections" className="wrap h-11 overflow-x-auto overflow-y-hidden border-t border-rule md:hidden">
          <Suspense fallback={<NavLinks area={area} />}>
            <ActiveNavLinks area={area} />
          </Suspense>
        </nav>
      </header>

      <div className="border-b border-rule bg-paper">
        <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2">
          <p className="t-label text-ink-2">Demo build · sample records · nothing leaves this browser</p>
          <button
            type="button"
            onClick={() => demo.reset()}
            className="t-label text-blue underline decoration-blue/30 underline-offset-4 hover:decoration-blue"
          >
            Restore sample records
          </button>
        </div>
      </div>

      <main className="wrap flex-1 py-10 md:py-14">
        {hydrated && allowed ? (
          <Suspense fallback={<Waiting />}>{children}</Suspense>
        ) : (
          <Waiting />
        )}
      </main>

      <Toaster />
    </>
  );
}

function Waiting() {
  return (
    <div aria-busy="true" aria-label="Opening your records" className="space-y-4">
      <div className="h-3 w-32 rounded-xs bg-rule" />
      <div className="h-9 w-80 max-w-full rounded-xs bg-rule" />
      <div className="mt-10 h-px w-full bg-rule" />
      <div className="h-24 w-full rounded-xs bg-paper" />
    </div>
  );
}
