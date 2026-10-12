import { Stamp } from "@/components/ui/stamp";
import { inr } from "@/lib/format";

/*
  The daily position sheet a treasury client receives. Figures are for an
  invented company and add up: limits total ₹4.2 crore, as on its sample file.
*/

type Line = { bank: string; account: string; balance?: number; limit?: number; drawn?: number };

const LINES: Line[] = [
  { bank: "Bank A", account: "Current account", balance: 1_842_300 },
  { bank: "Bank A", account: "Cash credit", limit: 25_000_000, drawn: 13_650_000 },
  { bank: "Bank B", account: "Current account", balance: 607_950 },
  { bank: "Bank B", account: "Overdraft", limit: 10_000_000, drawn: 4_120_000 },
  { bank: "Bank C", account: "Bill discounting", limit: 7_000_000, drawn: 5_275_000 },
];

const DUE = [
  { on: "14 Oct", what: "Term loan instalment, Bank B", amount: "₹4,85,000" },
  { on: "15 Oct", what: "Export receivable expected; 60% covered by a forward", amount: "USD 42,000" },
  { on: "16 Oct", what: "GST payment", amount: "₹7,20,000" },
  { on: "30 Oct", what: "Cash-credit renewal, Bank A. Renewal file in preparation", amount: "₹2,50,00,000" },
];

const sum = (pick: (line: Line) => number | undefined) => LINES.reduce((total, line) => total + (pick(line) ?? 0), 0);
const cell = (value?: number) => (value === undefined ? <span className="text-ink-3">—</span> : inr(value));

/** The share of a limit that is drawn, as a bar that fills to its value. */
function Used({ share }: { share: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="block h-1.5 w-14 overflow-hidden rounded-xs bg-rule">
        <span className="fill-bar block h-full bg-ink" style={{ "--fill": share } as React.CSSProperties} />
      </span>
      <span className="t-data text-[0.75rem] text-ink-2">{Math.round(share * 100)}%</span>
    </span>
  );
}

export function PositionSheet() {
  const cash = sum((l) => l.balance);
  const limits = sum((l) => l.limit);
  const drawn = sum((l) => l.drawn);

  return (
    <div className="rounded-sm border border-rule-2 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-rule px-5 py-3.5">
        <p className="text-sm font-semibold">
          Position sheet <span className="font-normal text-ink-3">·</span> <span className="font-normal text-ink-2">Kaveri Agro Foods Pvt Ltd</span>
        </p>
        <div className="flex items-center gap-3">
          <span className="t-data text-ink-3">12 Oct 2026, 09:30</span>
          <Stamp>Sample</Stamp>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead>
            <tr className="t-label border-b border-ink text-ink-3">
              <th scope="col" className="py-2.5 pr-3 pl-5 font-normal">
                Account
              </th>
              <th scope="col" className="py-2.5 pr-3 text-right font-normal">
                Cash
              </th>
              <th scope="col" className="py-2.5 pr-3 text-right font-normal">
                Limit
              </th>
              <th scope="col" className="py-2.5 pr-3 text-right font-normal">
                Drawn
              </th>
              <th scope="col" className="py-2.5 pr-3 font-normal">
                Used
              </th>
              <th scope="col" className="py-2.5 pr-5 text-right font-normal">
                Headroom
              </th>
            </tr>
          </thead>
          <tbody>
            {LINES.map((line) => (
              <tr key={`${line.bank}-${line.account}`} className="border-b border-rule transition-colors duration-150 hover:bg-paper">
                <th scope="row" className="py-3 pr-3 pl-5 font-normal text-ink">
                  {line.account} <span className="text-ink-3">· {line.bank}</span>
                </th>
                <td className="t-data py-3 pr-3 text-right">{cell(line.balance)}</td>
                <td className="t-data py-3 pr-3 text-right">{cell(line.limit)}</td>
                <td className="t-data py-3 pr-3 text-right">{cell(line.drawn)}</td>
                <td className="py-3 pr-3">{line.limit !== undefined && line.drawn !== undefined && <Used share={line.drawn / line.limit} />}</td>
                <td className="t-data py-3 pr-5 text-right">{cell(line.limit !== undefined && line.drawn !== undefined ? line.limit - line.drawn : undefined)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-b border-ink">
              <th scope="row" className="py-3 pr-3 pl-5 font-semibold text-ink">
                Total
              </th>
              <td className="t-data py-3 pr-3 text-right font-medium">{inr(cash)}</td>
              <td className="t-data py-3 pr-3 text-right font-medium">{inr(limits)}</td>
              <td className="t-data py-3 pr-3 text-right font-medium">{inr(drawn)}</td>
              <td className="py-3 pr-3">
                <Used share={drawn / limits} />
              </td>
              <td className="t-data py-3 pr-5 text-right font-medium text-blue">{inr(limits - drawn)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="px-5 pt-5 pb-2">
        <p className="t-label text-ink-3">Due in the next 20 days</p>
        <ul className="mt-2">
          {DUE.map((item) => (
            <li key={item.on + item.what} className="grid grid-cols-[3.75rem_1fr] items-baseline gap-x-4 border-t border-rule py-3 text-sm sm:grid-cols-[3.75rem_1fr_auto]">
              <span className="t-data text-ink-3">{item.on}</span>
              <span className="text-ink">{item.what}</span>
              <span className="t-data col-start-2 text-ink-2 sm:col-start-3 sm:text-right">{item.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
