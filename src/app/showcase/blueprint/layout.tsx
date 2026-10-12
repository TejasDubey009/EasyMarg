import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./blueprint.css";

const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--bp-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--bp-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Blueprint",
  description: "EasyMarg, reference direction 02: white paper, hairlines, a dotted grid and acid green for highlights only.",
};

export default function BlueprintLayout({ children }: LayoutProps<"/showcase/blueprint">) {
  return <div className={`showcase bp ${sans.variable} ${mono.variable}`}>{children}</div>;
}
