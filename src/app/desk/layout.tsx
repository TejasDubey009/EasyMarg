import type { Metadata } from "next";
import { AppShell } from "@/components/app/shell";

export const metadata: Metadata = {
  title: { default: "Desk", template: "%s — EasyMarg desk" },
  robots: { index: false },
};

export default function DeskLayout({ children }: LayoutProps<"/desk">) {
  return <AppShell area="staff">{children}</AppShell>;
}
