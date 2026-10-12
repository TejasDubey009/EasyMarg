import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./nightline.css";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--nl-serif", display: "swap" });
const sans = Geist({ subsets: ["latin"], variable: "--nl-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--nl-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Nightline",
  description: "EasyMarg, reference direction 01: a midnight canvas, a serif display and one cobalt signal.",
};

export default function NightlineLayout({ children }: LayoutProps<"/showcase/nightline">) {
  return <div className={`showcase nl ${serif.variable} ${sans.variable} ${mono.variable}`}>{children}</div>;
}
