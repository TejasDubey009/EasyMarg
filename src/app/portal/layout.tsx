import type { Metadata } from "next";
import { AppShell } from "@/components/app/shell";

export const metadata: Metadata = {
  title: { default: "Your files", template: "%s — EasyMarg" },
  robots: { index: false },
};

export default function PortalLayout({ children }: LayoutProps<"/portal">) {
  return <AppShell area="customer">{children}</AppShell>;
}
