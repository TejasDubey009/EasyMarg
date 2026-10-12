import type { Metadata } from "next";
import Screen from "./screen";

export const metadata: Metadata = { title: "Queue" };

// Signed-in screens read the session in the browser; there is nothing to prerender or validate here.
export const instant = false;

export default function Page() {
  return <Screen />;
}
