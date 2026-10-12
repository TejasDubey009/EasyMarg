"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { ChoiceGroup, TextField } from "@/components/ui/field";
import { ArrowLeft } from "@/components/ui/icons";
import { DEMO_CUSTOMERS } from "@/lib/data";
import { demo } from "@/lib/store";

type Door = "customer" | "team";
type Account = keyof typeof DEMO_CUSTOMERS;

const DOORS: { value: Door; label: string }[] = [
  { value: "customer", label: "Customer" },
  { value: "team", label: "EasyMarg team" },
];

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const start = params.get("start");

  const [door, setDoor] = useState<Door>(params.get("as") === "team" ? "team" : "customer");
  const [account, setAccount] = useState<Account>(start === "treasury" ? "company" : "individual");
  const [mobile, setMobile] = useState("");
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const switchDoor = (next: Door) => {
    setDoor(next);
    setSent(false);
    setCode("");
    setError(null);
  };

  const sendCode = (event: FormEvent) => {
    event.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter your 10-digit mobile number, without +91 or a leading 0.");
      return;
    }
    setError(null);
    setSent(true);
  };

  const signInCustomer = (event: FormEvent) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError("The code has 6 digits. Check the message and try again.");
      return;
    }
    demo.signIn({ role: "customer", clientId: DEMO_CUSTOMERS[account] });
    router.push(start === "home-loan" || start === "treasury" ? `/portal/apply?kind=${start}` : start ? "/portal/apply" : "/portal");
  };

  const signInTeam = (event: FormEvent) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter your work email, like name@easymarg.com.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    demo.signIn({ role: "staff", name: "Priya Nair" });
    router.push("/desk");
  };

  return (
    <div className="w-full max-w-[26rem]">
      <h1 className="t-h2">Sign in</h1>
      <p className="mt-3 text-ink-2">
        {start === "home-loan"
          ? "A file needs an owner. Sign in with your mobile number and we will open your home-loan application."
          : start === "treasury"
            ? "A mandate needs an owner. Sign in with your mobile number and we will open your treasury request."
            : start
              ? "A file needs an owner. Sign in with your mobile number and we will open your application."
              : "Open your file, your papers and your record room."}
      </p>

      <div role="group" aria-label="Who is signing in" className="mt-8 grid grid-cols-2 border-b border-rule">
        {DOORS.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={door === item.value}
            onClick={() => switchDoor(item.value)}
            className={`-mb-px h-11 border-b-2 text-[0.9375rem] font-medium transition-colors ${
              door === item.value ? "border-blue text-blue" : "border-transparent text-ink-2 hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Stated plainly: this build has no SMS gateway and no accounts behind it. */}
      <p className="mt-6 rounded-sm border border-rule-2 bg-paper px-3.5 py-3 text-sm leading-relaxed text-ink-2">
        <span className="t-label mr-2 font-medium text-ink">Demo build</span>
        {door === "customer"
          ? "No message is sent. Any valid mobile number and any 6-digit code opens the sample account you choose below."
          : "No account is checked. Any email and password opens the desk as a sample case officer."}
      </p>

      {door === "customer" && !sent && (
        <form onSubmit={sendCode} noValidate className="mt-6 space-y-5">
          <TextField
            label="Mobile number"
            lead="+91"
            name="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98765 43210"
            maxLength={10}
            value={mobile}
            onChange={(event) => setMobile(event.target.value.replace(/\D/g, ""))}
            error={error ?? undefined}
            hint="We send a 6-digit code to this number."
            className="t-data text-[0.9375rem]"
          />
          <ChoiceGroup
            legend="Sample account to open"
            name="account"
            value={account}
            onChange={setAccount}
            options={[
              { value: "individual", label: "An individual", note: "Home-loan file at the lender-review milestone." },
              { value: "company", label: "A company", note: "Treasury mandate with the desk live." },
            ]}
          />
          <Button type="submit" className="w-full">
            Send code
          </Button>
        </form>
      )}

      {door === "customer" && sent && (
        <form onSubmit={signInCustomer} noValidate className="mt-6 space-y-5">
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setCode("");
              setError(null);
            }}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue underline-offset-4 hover:underline"
          >
            <ArrowLeft />
            Change number
          </button>
          <TextField
            label={`Code sent to +91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`}
            name="code"
            // The person has just asked for a code; the next thing they do is type it.
            autoFocus
            inputMode="numeric"
            autoComplete="one-time-code"
            spellCheck={false}
            placeholder="6 digits"
            maxLength={6}
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            error={error ?? undefined}
            className="t-data text-[1.0625rem] tracking-[0.3em]"
          />
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      )}

      {door === "team" && (
        <form onSubmit={signInTeam} noValidate className="mt-6 space-y-5">
          <TextField
            label="Work email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="name@easymarg.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={error?.includes("email") ? error : undefined}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={error?.includes("password") ? error : undefined}
          />
          <Button type="submit" className="w-full">
            Sign in to the desk
          </Button>
        </form>
      )}
    </div>
  );
}
