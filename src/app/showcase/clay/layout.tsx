import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Mono, DM_Sans } from "next/font/google";
import "./clay.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], variable: "--cl-display", display: "swap" });
const sans = DM_Sans({ subsets: ["latin"], axes: ["opsz"], variable: "--cl-sans", display: "swap" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--cl-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Clay",
  description: "EasyMarg, reference direction 03: warm stone surfaces, black pill buttons, cushion panels and six matte clay milestones.",
};

export default function ClayLayout({ children }: LayoutProps<"/showcase/clay">) {
  return <div className={`showcase cl ${display.variable} ${sans.variable} ${mono.variable}`}>{children}</div>;
}
