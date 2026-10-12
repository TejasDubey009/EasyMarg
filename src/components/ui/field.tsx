"use client";

import { useId, useRef, useState, type ComponentProps } from "react";
import { Upload } from "./icons";

const INPUT =
  "h-11 w-full rounded-sm border border-rule-2 bg-white px-3 text-[0.9375rem] text-ink placeholder:text-ink-3 transition-colors hover:border-ink-3 focus:border-blue focus:outline-none focus:ring-3 focus:ring-blue/15 aria-[invalid=true]:border-stop";

type Shell = { label: string; hint?: string; error?: string };

function FieldShell({ id, label, hint, error, children }: Shell & { id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-stop">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

/** A single-line input. `lead` is a fixed prefix such as +91 or ₹. */
export function TextField({ label, hint, error, lead, className, ...props }: Shell & { lead?: string } & ComponentProps<"input">) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <div className="relative">
        {lead && (
          <span className="t-data pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-center border-r border-rule text-ink-2">
            {lead}
          </span>
        )}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={[INPUT, lead ? "pl-[3.75rem]" : "", className].filter(Boolean).join(" ")}
          {...props}
        />
      </div>
    </FieldShell>
  );
}

export function SelectField({ label, hint, error, children, className, ...props }: Shell & ComponentProps<"select">) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={[INPUT, "appearance-none bg-[length:10px] bg-[position:right_0.875rem_center] bg-no-repeat pr-9", className].filter(Boolean).join(" ")}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6' fill='none' stroke='%2314171f' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m1 1 4 4 4-4'/%3E%3C/svg%3E\")",
        }}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
}

export function TextArea({ label, hint, error, className, ...props }: Shell & ComponentProps<"textarea">) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={[INPUT, "h-auto min-h-24 py-2.5 leading-relaxed", className].filter(Boolean).join(" ")}
        {...props}
      />
    </FieldShell>
  );
}

/** One choice out of a few, each with a line of explanation. */
export function ChoiceGroup<T extends string>({
  legend,
  name,
  value,
  onChange,
  options,
  columns = 1,
}: {
  legend: string;
  name: string;
  value: T | "";
  onChange: (value: T) => void;
  options: { value: T; label: string; note?: string }[];
  columns?: 1 | 2;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-ink">{legend}</legend>
      <div className={`grid gap-2 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-sm border px-3.5 py-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue ${
                checked ? "border-blue bg-blue-wash" : "border-rule-2 bg-white hover:border-ink-3"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-[3px] flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px] ${checked ? "border-blue" : "border-rule-2"}`}
              >
                {checked && <span className="size-2 rounded-full bg-blue" />}
              </span>
              <span className="min-w-0">
                <span className="block text-[0.9375rem] leading-snug font-medium text-ink">{option.label}</span>
                {option.note && <span className="mt-0.5 block text-sm leading-snug text-ink-2">{option.note}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export type Picked = { filename: string; sizeKb: number };

/**
 * Picks a file from the device. This demo build reads only its name and size;
 * nothing leaves the browser.
 */
export function FileButton({
  label,
  onPick,
  variant = "primary",
}: {
  label: string;
  onPick: (file: Picked) => void;
  variant?: "primary" | "outline";
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={input}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.zip"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onPick({ filename: file.name, sizeKb: Math.max(1, Math.round(file.size / 1024)) });
          event.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => input.current?.click()}
        className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
          variant === "primary" ? "bg-blue text-white hover:bg-blue-deep" : "border border-blue bg-white text-blue hover:bg-blue-wash"
        }`}
      >
        <Upload />
        {label}
      </button>
    </>
  );
}

/** A drop target. The dashed edge means: a file can be dropped here. */
export function DropZone({ picked, onPick }: { picked: Picked | null; onPick: (file: Picked | null) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const take = (file?: File | null) => {
    if (file) onPick({ filename: file.name, sizeKb: Math.max(1, Math.round(file.size / 1024)) });
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setOver(false);
        take(event.dataTransfer.files?.[0]);
      }}
      className={`rounded-sm border border-dashed px-4 py-6 text-center transition-colors ${over ? "border-blue bg-blue-wash" : "border-rule-2 bg-paper"}`}
    >
      <input
        ref={input}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.zip"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          take(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      {picked ? (
        <p className="text-sm text-ink">
          <span className="t-data">{picked.filename}</span>{" "}
          <button type="button" onClick={() => onPick(null)} className="ml-2 font-medium text-blue underline underline-offset-4">
            Remove
          </button>
        </p>
      ) : (
        <p className="text-sm text-ink-2">
          Drop a file here, or{" "}
          <button type="button" onClick={() => input.current?.click()} className="font-medium text-blue underline underline-offset-4">
            choose from your device
          </button>
          <span className="mt-1 block text-ink-3">PDF, JPG, PNG or XLSX</span>
        </p>
      )}
    </div>
  );
}
