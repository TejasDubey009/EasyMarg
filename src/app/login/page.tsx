import type { Metadata } from "next";
import { Suspense } from "react";
import { Wordmark } from "@/components/brand";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

const BEHIND = [
  { title: "Your file", body: "Which milestone it is standing at, who has it, and what it is waiting for." },
  { title: "Your papers", body: "Each one numbered, checked by an officer, and kept on record for life." },
  { title: "Your case officer", body: "One name, from the first paper to the last." },
];

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div className="flex flex-col px-5 py-6 sm:px-10 sm:py-8">
        <Wordmark />
        <main className="flex flex-1 items-center justify-center py-12">
          <Suspense fallback={<div className="h-96 w-full max-w-[26rem]" />}>
            <LoginForm />
          </Suspense>
        </main>
        <p className="text-sm text-ink-3">
          Trouble signing in? Write to{" "}
          <a href="mailto:support@easymarg.com" className="text-ink underline underline-offset-4">
            support@easymarg.com
          </a>
        </p>
      </div>

      <aside className="on-blue hidden flex-col justify-between bg-blue px-12 py-10 text-white lg:flex">
        <p className="t-label text-blue-tint">Behind the sign-in</p>
        <ul>
          {BEHIND.map((item) => (
            <li key={item.title} className="border-t border-white/25 py-6 last:border-b">
              <h2 className="text-[1.375rem] leading-tight font-semibold tracking-[-0.018em] [font-stretch:112%]">{item.title}</h2>
              <p className="mt-2 max-w-[36ch] text-white/85">{item.body}</p>
            </li>
          ))}
        </ul>
        <p className="max-w-[40ch] text-sm leading-relaxed text-white/85">
          No EasyMarg officer will ever ask for your code, your PIN or your net-banking password. If someone using our name does,
          it is not us.
        </p>
      </aside>
    </div>
  );
}
