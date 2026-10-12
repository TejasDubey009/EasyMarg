"use client";

import { useSyncExternalStore } from "react";

const clock = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false });

function subscribe(notify: () => void) {
  const timer = setInterval(notify, 15_000);
  return () => clearInterval(timer);
}

/** The time at the desk right now, so you know whether anyone is likely to pick up. */
export function IndiaClock() {
  const time = useSyncExternalStore(
    subscribe,
    () => clock.format(new Date()),
    () => "",
  );
  return <span className="t-data [font-size:inherit]">{time ? `${time} IST` : "IST"}</span>;
}
