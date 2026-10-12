import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

// One grotesque in two widths: the wide cut for headings, the normal cut for text.
const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--ff-archivo",
  display: "swap",
});

// Mono is reserved for data: file numbers, amounts, dates.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--ff-mono",
  display: "swap",
});

// Only used to set the word मार्ग.
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["500"],
  variable: "--ff-deva",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://easymarg.com"),
  title: {
    default: "EasyMarg — Financial services, with a way through.",
    template: "%s — EasyMarg",
  },
  description:
    "EasyMarg is a financial services destination for individuals and companies. One case officer per file, every paper kept on record for life. Open today: home loans after a decline, and treasury for growing companies.",
};

export const viewport: Viewport = {
  themeColor: "#153a9c",
};

import { Suspense } from "react";
import { TemplateSwitcher } from "@/components/template-switcher";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" className={`${archivo.variable} ${plexMono.variable} ${devanagari.variable}`}>
      <body className="flex min-h-dvh flex-col">
        {children}
        <Suspense fallback={null}>
          <TemplateSwitcher />
        </Suspense>
      </body>
    </html>
  );
}
