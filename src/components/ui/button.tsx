import Link from "next/link";
import type { ComponentProps } from "react";

/*
  Buttons.
  primary          → the one thing this screen is for. Brand blue.
  outline          → a second, real option.
  quiet            → a small action inside a row.
  on-blue / -line  → the same two roles when sitting on the brand block.
*/

type Variant = "primary" | "outline" | "quiet" | "on-blue" | "on-blue-line";
type Size = "md" | "sm";

const BASE =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40";

const SIZES: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  sm: "h-9 px-3.5 text-sm",
};

const VARIANTS: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-blue-deep",
  outline: "border border-blue text-blue hover:bg-blue-wash",
  quiet: "border border-rule-2 bg-white text-ink hover:border-ink",
  "on-blue": "bg-white text-blue hover:bg-blue-wash",
  "on-blue-line": "border border-white/55 text-white hover:border-white hover:bg-white/10",
};

type Style = { variant?: Variant; size?: Size };

function classes({ variant = "primary", size = "md" }: Style, extra?: string) {
  return [BASE, SIZES[size], VARIANTS[variant], extra].filter(Boolean).join(" ");
}

export function Button({ variant, size, className, type = "button", ...props }: Style & ComponentProps<"button">) {
  return <button type={type} className={classes({ variant, size }, className)} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: Style & ComponentProps<typeof Link>) {
  return <Link className={classes({ variant, size }, className)} {...props} />;
}

/** A text link that leads somewhere. Underlined on hover, arrow supplied by the caller. */
export function TextLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={[
        "inline-flex items-center gap-1.5 font-medium text-blue underline decoration-blue/30 decoration-1 underline-offset-4 hover:decoration-blue",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
