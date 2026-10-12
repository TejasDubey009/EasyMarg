"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useMine } from "@/components/app/use-records";
import { Button } from "@/components/ui/button";
import { ChoiceGroup, SelectField, TextField } from "@/components/ui/field";
import { ArrowLeft } from "@/components/ui/icons";
import { Facts } from "@/components/ui/layout";
import { CHECKLIST, type Kind } from "@/lib/data";
import { inr, inrWords } from "@/lib/format";
import { notify } from "@/lib/notify";
import { demo } from "@/lib/store";

const MARKS = [
  "Missed EMIs",
  "A settled or written-off account",
  "Cards near their limit",
  "Several loan applications recently",
  "No credit history",
  "I am not sure",
];

const STEPS: Record<Kind, string[]> = {
  "home-loan": ["What you need", "The home", "Your income and credit", "Check and open"],
  treasury: ["What you need", "The company", "Who the desk reports to", "Check and open"],
};

type Form = {
  kind: Kind | "";
  // home loan
  property: string;
  city: string;
  value: string;
  loan: string;
  work: "Salaried" | "Self-employed" | "";
  income: string;
  score: string;
  marks: string[];
  // treasury
  banks: string;
  limits: string;
  debt: string;
  fx: string;
  contact: string;
  designation: string;
  pressing: string;
  consent: boolean;
};

const digits = (value: string) => value.replace(/\D/g, "");
const num = (value: string) => Number(digits(value) || 0);

function Money({ label, value, onChange, error, hint }: { label: string; value: string; onChange: (value: string) => void; error?: string; hint?: string }) {
  const amount = num(value);
  return (
    <TextField
      label={label}
      lead="₹"
      inputMode="numeric"
      autoComplete="off"
      value={amount ? inr(amount).slice(1) : ""}
      onChange={(event) => onChange(digits(event.target.value).slice(0, 11))}
      error={error}
      hint={amount >= 100_000 ? `${inrWords(amount)}${hint ? `. ${hint}` : ""}` : hint}
      className="t-data text-[0.9375rem]"
    />
  );
}

export default function ApplyPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { client } = useMine();
  const asked = params.get("kind");

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Form>({
    kind: asked === "home-loan" || asked === "treasury" ? asked : "",
    property: "Flat",
    city: "",
    value: "",
    loan: "",
    work: "",
    income: "",
    score: "",
    marks: [],
    banks: "",
    limits: "",
    debt: "",
    fx: "None",
    contact: "",
    designation: "",
    pressing: "A limit is up for renewal",
    consent: false,
  });

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const kind = form.kind || "home-loan";
  const steps = STEPS[kind];
  const homeLoan = form.kind === "home-loan";

  const check = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (step === 0 && !form.kind) e.kind = "Choose one to continue.";
    if (step === 1 && homeLoan) {
      if (!form.city.trim()) e.city = "Enter the city or town the property is in.";
      if (num(form.value) < 100_000) e.value = "Enter the price on the agreement, in rupees.";
      if (num(form.loan) < 100_000) e.loan = "Enter the loan you need, in rupees.";
      else if (num(form.value) >= 100_000 && num(form.loan) > num(form.value)) e.loan = "The loan cannot be more than the agreement value.";
    }
    if (step === 1 && !homeLoan) {
      if (num(form.banks) < 1) e.banks = "Enter how many banks the company works with.";
      if (num(form.limits) < 100_000) e.limits = "Enter the total of your sanctioned limits, in rupees.";
    }
    if (step === 2 && homeLoan) {
      if (!form.work) e.work = "Choose how you earn.";
      if (num(form.income) < 1000) e.income = "Enter your monthly income after tax, in rupees.";
      if (form.score && (num(form.score) < 300 || num(form.score) > 900)) e.score = "A CIBIL score is between 300 and 900. Leave this empty if you do not know it.";
    }
    if (step === 2 && !homeLoan) {
      if (!form.contact.trim()) e.contact = "Enter the name of the person the desk will report to.";
      if (!form.designation.trim()) e.designation = "Enter their designation, like Finance Head.";
    }
    if (step === 3 && !form.consent) e.consent = homeLoan ? "We cannot read your credit report without your consent." : "Confirm that you may open this request for the company.";
    return e;
  };

  const facts = homeLoan
    ? [
        { label: "Applicant", value: client?.name ?? "" },
        { label: "Property", value: `${form.property}, ${form.city.trim()}` },
        { label: "Agreement value", value: inr(num(form.value)) },
        { label: "Loan sought", value: inr(num(form.loan)) },
        { label: "Income", value: `${form.work}, ${inr(num(form.income))} a month` },
        { label: "Score, as declared", value: form.score ? form.score : "Not known" },
        { label: "Declared marks", value: form.marks.length ? form.marks.join(". ") + "." : "None declared." },
      ]
    : [
        { label: "Company", value: client?.name ?? "" },
        { label: "Banks", value: form.banks },
        { label: "Fund-based limits", value: inrWords(num(form.limits)) },
        { label: "Term debt outstanding", value: num(form.debt) ? inrWords(num(form.debt)) : "None declared" },
        { label: "FX exposure", value: form.fx },
        { label: "Desk reports to", value: `${form.contact.trim()}, ${form.designation.trim()}` },
        { label: "Most pressing", value: form.pressing },
      ];

  const next = (event: FormEvent) => {
    event.preventDefault();
    const found = check();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    if (!client || !form.kind) return;
    const id = demo.open({
      kind: form.kind,
      clientId: client.id,
      subject: homeLoan ? `${form.property}, ${form.city.trim()}` : "Treasury desk",
      amount: homeLoan ? num(form.loan) : num(form.limits),
      facts,
    });
    notify("Your file is open. Start with the papers it is asking for.");
    window.scrollTo({ top: 0 });
    router.push(`/portal/files/${id}`);
  };

  return (
    <div className="mx-auto max-w-[44rem]">
      <p className="t-label text-ink-3">
        Step {step + 1} of {steps.length}
      </p>
      <div aria-hidden="true" className="mt-3 flex gap-1">
        {steps.map((name, i) => (
          <span key={name} className={`h-1 flex-1 rounded-xs ${i <= step ? "bg-blue" : "bg-rule"}`} />
        ))}
      </div>
      <h1 className="t-h1 mt-8">{step === 0 ? "Start an application" : steps[step]}</h1>

      <form onSubmit={next} noValidate className="mt-8 space-y-6">
        {step === 0 && (
          <>
            <p className="text-ink-2">Each application becomes a file, with its own number, milestones and papers.</p>
            <ChoiceGroup<Kind>
              legend="What do you need?"
              name="kind"
              value={form.kind}
              onChange={(value) => set("kind", value)}
              options={[
                { value: "home-loan", label: "A home loan", note: "For an individual or a couple, including after a decline elsewhere." },
                { value: "treasury", label: "A treasury mandate", note: "For a company: cash position, limits, surplus and FX." },
              ]}
            />
            {errors.kind && (
              <p role="alert" className="text-sm text-stop">
                {errors.kind}
              </p>
            )}
          </>
        )}

        {step === 1 && homeLoan && (
          <>
            <SelectField label="What are you buying?" value={form.property} onChange={(event) => set("property", event.target.value)}>
              {["Flat", "Independent house", "Row house or villa", "Plot and construction", "Resale property"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </SelectField>
            <TextField label="City or town" autoComplete="address-level2" value={form.city} onChange={(event) => set("city", event.target.value)} error={errors.city} placeholder="Pune" />
            <div className="grid gap-6 sm:grid-cols-2">
              <Money label="Agreement value" value={form.value} onChange={(value) => set("value", value)} error={errors.value} />
              <Money label="Loan you need" value={form.loan} onChange={(value) => set("loan", value)} error={errors.loan} />
            </div>
          </>
        )}

        {step === 1 && !homeLoan && (
          <>
            <TextField
              label="How many banks does the company work with?"
              inputMode="numeric"
              value={form.banks}
              onChange={(event) => set("banks", digits(event.target.value).slice(0, 2))}
              error={errors.banks}
              className="t-data text-[0.9375rem]"
            />
            <div className="grid gap-6 sm:grid-cols-2">
              <Money label="Sanctioned limits, total" value={form.limits} onChange={(value) => set("limits", value)} error={errors.limits} hint="Cash credit, overdraft, bill discounting" />
              <Money label="Term debt outstanding" value={form.debt} onChange={(value) => set("debt", value)} hint="Leave empty if none" />
            </div>
            <SelectField label="Foreign-currency exposure" value={form.fx} onChange={(event) => set("fx", event.target.value)}>
              {["None", "Receivables", "Payables", "Receivables and payables"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </SelectField>
          </>
        )}

        {step === 2 && homeLoan && (
          <>
            <p className="text-ink-2">
              Tell us what a lender will find. Nothing on this page goes to a lender; it tells your case officer what to look for when reading your
              report.
            </p>
            <div>
              <ChoiceGroup
                legend="How do you earn?"
                name="work"
                columns={2}
                value={form.work}
                onChange={(value) => set("work", value)}
                options={[
                  { value: "Salaried", label: "Salaried" },
                  { value: "Self-employed", label: "Self-employed" },
                ]}
              />
              {errors.work && (
                <p role="alert" className="mt-1.5 text-sm text-stop">
                  {errors.work}
                </p>
              )}
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Money label="Monthly income, after tax" value={form.income} onChange={(value) => set("income", value)} error={errors.income} />
              <TextField
                label="CIBIL score, if you know it"
                inputMode="numeric"
                value={form.score}
                onChange={(event) => set("score", digits(event.target.value).slice(0, 3))}
                error={errors.score}
                hint="300 to 900. Leave empty if not."
                className="t-data text-[0.9375rem]"
              />
            </div>
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-ink">Which of these are on your record? Tick all that apply.</legend>
              <div className="grid gap-x-6 sm:grid-cols-2">
                {MARKS.map((mark) => (
                  <label key={mark} className="flex cursor-pointer items-center gap-3 border-b border-rule py-3 text-[0.9375rem] text-ink">
                    <input
                      type="checkbox"
                      checked={form.marks.includes(mark)}
                      onChange={(event) => set("marks", event.target.checked ? [...form.marks, mark] : form.marks.filter((m) => m !== mark))}
                      className="size-[1.125rem] shrink-0 accent-blue"
                    />
                    {mark}
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {step === 2 && !homeLoan && (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField label="Name" autoComplete="name" value={form.contact} onChange={(event) => set("contact", event.target.value)} error={errors.contact} />
              <TextField label="Designation" autoComplete="organization-title" value={form.designation} onChange={(event) => set("designation", event.target.value)} error={errors.designation} placeholder="Finance Head" />
            </div>
            <SelectField label="What is most pressing?" value={form.pressing} onChange={(event) => set("pressing", event.target.value)}>
              {["A limit is up for renewal", "No daily view of cash", "Cash sitting idle", "FX exposure is open", "New borrowing to arrange"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </SelectField>
          </>
        )}

        {step === 3 && (
          <>
            <Facts rows={facts} />
            <div>
              <h2 className="t-h3">Your file will open by asking for {CHECKLIST[kind].length} papers</h2>
              <ul className="mt-3 border-t border-rule">
                {CHECKLIST[kind].map((item) => (
                  <li key={item.title} className="grid gap-x-4 border-b border-rule py-2.5 text-sm sm:grid-cols-[5.5rem_1fr]">
                    <span className="t-label pt-0.5 text-ink-3">{item.group}</span>
                    <span className="text-ink">{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label className="flex cursor-pointer items-start gap-3 rounded-sm border border-rule-2 px-4 py-3.5 text-[0.9375rem] leading-relaxed text-ink has-[:checked]:border-blue has-[:checked]:bg-blue-wash">
                <input type="checkbox" checked={form.consent} onChange={(event) => set("consent", event.target.checked)} className="mt-1 size-[1.125rem] shrink-0 accent-blue" />
                {homeLoan
                  ? "I consent to EasyMarg obtaining my credit report from a credit bureau for this application. It will not be shared with any lender until I approve a shortlist."
                  : `I am authorised to open this request on behalf of ${client?.name ?? "the company"}.`}
              </label>
              {errors.consent && (
                <p role="alert" className="mt-1.5 text-sm text-stop">
                  {errors.consent}
                </p>
              )}
            </div>
          </>
        )}

        <div className="flex items-center justify-between gap-4 border-t border-ink pt-6">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => {
                setStep(step - 1);
                setErrors({});
              }}
              className="inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-ink-2 underline-offset-4 hover:text-ink hover:underline"
            >
              <ArrowLeft />
              Back
            </button>
          ) : (
            <span />
          )}
          <Button type="submit">{step === steps.length - 1 ? "Open my file" : "Continue"}</Button>
        </div>
      </form>
    </div>
  );
}
