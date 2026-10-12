import type { Metadata } from "next";
import "@/showcase/showcase.css";

export const metadata: Metadata = {
  title: { default: "Showcase", template: "%s — EasyMarg showcase" },
  robots: { index: false, follow: false },
};

export default function ShowcaseLayout({ children }: LayoutProps<"/showcase">) {
  return children;
}
