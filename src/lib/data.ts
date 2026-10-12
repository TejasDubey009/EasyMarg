/*
  The shape of an EasyMarg file, and the sample records the demo runs on.
  Every person, company and figure below is invented for the demo.
*/

export type Kind = "home-loan" | "treasury";
export type Party = "you" | "easymarg" | "lender";

export type Milestone = {
  key: string;
  title: string;
  /** Who has to act for the file to pass this milestone. */
  who: Party;
  what: string;
  /** The paper that joins the record when this milestone is passed. */
  paper: string;
};

/** The road a file travels. The order is the order things happen in. */
export const ROAD: Record<Kind, Milestone[]> = {
  "home-loan": [
    {
      key: "report",
      title: "Report read",
      who: "easymarg",
      what: "With your consent we pull your credit report and read every line of it.",
      paper: "Credit reading note",
    },
    {
      key: "file",
      title: "File built",
      who: "you",
      what: "You upload what a lender will ask for. We check each paper before it counts.",
      paper: "Your documents, checked",
    },
    {
      key: "shortlist",
      title: "Lenders shortlisted",
      who: "easymarg",
      what: "We shortlist lenders whose policy fits your file. Nothing is sent until you approve the list.",
      paper: "Shortlist and your consent",
    },
    {
      key: "review",
      title: "Lender review",
      who: "lender",
      what: "Credit appraisal, then legal and technical checks on the property. We answer the lender's queries with you.",
      paper: "Lender queries and replies",
    },
    {
      key: "sanction",
      title: "Sanction",
      who: "lender",
      what: "The lender issues a sanction letter. We read its conditions with you before you sign.",
      paper: "Sanction letter",
    },
    {
      key: "disbursal",
      title: "Disbursal",
      who: "lender",
      what: "Agreement signed, funds released to the seller or builder.",
      paper: "Loan agreement and disbursal advice",
    },
  ],
  treasury: [
    {
      key: "mandate",
      title: "Mandate signed",
      who: "you",
      what: "Scope, access and reporting line agreed in writing.",
      paper: "Mandate letter",
    },
    {
      key: "position",
      title: "Position read",
      who: "easymarg",
      what: "Twelve months of statements, every limit and every loan read into one sheet.",
      paper: "Position note",
    },
    {
      key: "policy",
      title: "Policy approved",
      who: "you",
      what: "Your board approves where surplus may be placed and how much FX exposure may stay open.",
      paper: "Treasury policy",
    },
    {
      key: "live",
      title: "Desk live",
      who: "easymarg",
      what: "Daily position sheet, weekly call, limits and maturities tracked.",
      paper: "Daily position sheets",
    },
    {
      key: "review",
      title: "Quarterly review",
      who: "you",
      what: "What the desk did, what it cost, and what changes next quarter.",
      paper: "Quarterly review",
    },
  ],
};

export const KIND_LABEL: Record<Kind, string> = {
  "home-loan": "Home loan",
  treasury: "Treasury",
};

export const KIND_CODE: Record<Kind, string> = {
  "home-loan": "HL",
  treasury: "TR",
};

export type Client = {
  id: string;
  name: string;
  type: "individual" | "company";
  city: string;
};

export type CaseFile = {
  id: string;
  /** File number as written on every paper: EM/HL/26/00418. */
  no: string;
  kind: Kind;
  clientId: string;
  subject: string;
  amount: number;
  amountLabel: string;
  /** Index of the current milestone on ROAD[kind]. Equal to its length once the road is finished. */
  stage: number;
  /** The date each passed milestone was passed, in order. */
  passed: string[];
  stageSince: string;
  waitingOn: Party;
  waitingFor: string;
  openedOn: string;
  officer: string;
  facts: { label: string; value: string }[];
  activity: { on: string; by: string; text: string }[];
};

export type DocStatus = "needed" | "filed" | "verified" | "reupload";
export type DocGroup = "Identity" | "Income" | "Banking" | "Property" | "Credit" | "Company" | "Issued";
export const DOC_GROUPS: DocGroup[] = ["Identity", "Income", "Banking", "Property", "Credit", "Company", "Issued"];

export type Doc = {
  id: string;
  fileId: string;
  /** Position of this paper within its file. Paper 07 of file 00418 is written 00418/07. */
  serial: number;
  title: string;
  group: DocGroup;
  status: DocStatus;
  /** What we will accept for this paper, in one line. */
  accepts?: string;
  filename?: string;
  sizeKb?: number;
  filedOn?: string;
  filedBy?: "client" | "easymarg" | "lender";
  checkedBy?: string;
  checkedOn?: string;
  /** Why a paper was sent back, itemised. */
  issues?: { label: string; detail: string }[];
};

export type Session = { role: "customer"; clientId: string } | { role: "staff"; name: string };

export type DemoState = {
  session: Session | null;
  clients: Client[];
  files: CaseFile[];
  docs: Doc[];
};

export const OFFICERS = ["Priya Nair", "Dev Malhotra", "Arvind Menon"];

/** The papers every new file starts by asking for. */
export const CHECKLIST: Record<Kind, { title: string; group: DocGroup; accepts: string }[]> = {
  "home-loan": [
    { title: "PAN card", group: "Identity", accepts: "A clear scan or photo. PDF, JPG or PNG." },
    { title: "Aadhaar", group: "Identity", accepts: "Masked Aadhaar is fine." },
    {
      title: "Salary slips, last 3 months",
      group: "Income",
      accepts: "Self-employed? Upload ITRs with computation for the last 2 years instead.",
    },
    { title: "Form 16, last 2 years", group: "Income", accepts: "Both parts, from your employer." },
    {
      title: "Bank statements, last 12 months",
      group: "Banking",
      accepts: "Every account where salary or EMIs move. One unlocked PDF per account, not screenshots.",
    },
    {
      title: "Agreement to sale or allotment letter",
      group: "Property",
      accepts: "Signed by you and the seller or builder.",
    },
    {
      title: "Explanation letter for past defaults",
      group: "Credit",
      accepts: "Dated and signed. Your case officer will send you a draft.",
    },
  ],
  treasury: [
    { title: "Certificate of incorporation", group: "Company", accepts: "With MoA and AoA." },
    {
      title: "Board resolution appointing EasyMarg",
      group: "Company",
      accepts: "On letterhead, signed by two directors.",
    },
    { title: "Audited financials, last 2 years", group: "Company", accepts: "With auditor's report and schedules." },
    {
      title: "Sanction letters for existing limits",
      group: "Banking",
      accepts: "Every fund-based and non-fund-based limit, latest renewal.",
    },
    {
      title: "Bank statements, all accounts, 12 months",
      group: "Banking",
      accepts: "One unlocked PDF per account.",
    },
    { title: "Debt schedule", group: "Banking", accepts: "Lender, outstanding, rate, repayment dates. A spreadsheet is fine." },
    { title: "GST returns, last 12 months", group: "Company", accepts: "GSTR-3B for each month." },
  ],
};

export function fileRef(no: string): string {
  return no.split("/").pop() ?? no;
}

export function paperRef(file: Pick<CaseFile, "no">, serial: number): string {
  return `${fileRef(file.no)}/${String(serial).padStart(2, "0")}`;
}

/* ───────────────────────── Sample records ───────────────────────── */

const clients: Client[] = [
  { id: "c-anita", name: "Anita Deshmukh", type: "individual", city: "Pune" },
  { id: "c-kaveri", name: "Kaveri Agro Foods Pvt Ltd", type: "company", city: "Hubballi" },
  { id: "c-imran", name: "Imran Shaikh", type: "individual", city: "Nagpur" },
  { id: "c-lakshmi", name: "Lakshmi Iyer", type: "individual", city: "Coimbatore" },
  { id: "c-gurpreet", name: "Gurpreet Sandhu", type: "individual", city: "Ludhiana" },
  { id: "c-joseph", name: "Joseph Fernandes", type: "individual", city: "Mangaluru" },
  { id: "c-northline", name: "Northline Logistics LLP", type: "company", city: "Pune" },
  { id: "c-meenakshi", name: "Meenakshi Textiles Pvt Ltd", type: "company", city: "Tiruppur" },
];

const files: CaseFile[] = [
  {
    id: "hl-00418",
    no: "EM/HL/26/00418",
    kind: "home-loan",
    clientId: "c-anita",
    subject: "2 BHK flat, Baner, Pune",
    amount: 3_800_000,
    amountLabel: "Loan sought",
    stage: 3,
    passed: ["2026-08-24", "2026-09-09", "2026-09-18"],
    stageSince: "2026-09-22",
    waitingOn: "you",
    waitingFor: "The lender needs your bank statements again, complete and unlocked.",
    openedOn: "2026-08-21",
    officer: "Priya Nair",
    facts: [
      { label: "Applicant", value: "Anita Deshmukh" },
      { label: "Co-applicant", value: "Rohan Deshmukh, spouse" },
      { label: "Property", value: "2 BHK flat, Baner, Pune" },
      { label: "Agreement value", value: "₹52,00,000" },
      { label: "Loan sought", value: "₹38,00,000" },
      { label: "Tenure asked", value: "20 years" },
      { label: "Score at intake", value: "612, CIBIL, 21 Aug 2026" },
      { label: "Marks on report", value: "2 missed EMIs, 2023. 1 settled card, 2022." },
    ],
    activity: [
      {
        on: "2026-10-09",
        by: "Priya Nair",
        text: "Lender asked for complete bank statements. Pages are missing and the PDF is locked. Re-upload requested.",
      },
      { on: "2026-10-08", by: "Anita Deshmukh", text: "Filed the no-dues certificate for the closed personal loan." },
      { on: "2026-10-06", by: "Lender", text: "Technical valuation of the flat completed." },
      { on: "2026-09-29", by: "Lender", text: "Legal check on the title started." },
      { on: "2026-09-22", by: "Priya Nair", text: "File submitted to the first lender on the shortlist." },
      { on: "2026-09-18", by: "Anita Deshmukh", text: "Approved the shortlist of 2 lenders." },
      { on: "2026-09-09", by: "Priya Nair", text: "All papers checked. File complete." },
      { on: "2026-08-24", by: "Priya Nair", text: "Credit report read. Reading note filed." },
      { on: "2026-08-21", by: "EasyMarg", text: "File opened." },
    ],
  },
  {
    id: "tr-00031",
    no: "EM/TR/26/00031",
    kind: "treasury",
    clientId: "c-kaveri",
    subject: "Treasury desk",
    amount: 42_000_000,
    amountLabel: "Limits in scope",
    stage: 3,
    passed: ["2026-06-12", "2026-07-03", "2026-07-28"],
    stageSince: "2026-08-01",
    waitingOn: "you",
    waitingFor: "September stock statement, needed for the cash-credit renewal due 30 Oct.",
    openedOn: "2026-06-08",
    officer: "Arvind Menon",
    facts: [
      { label: "Company", value: "Kaveri Agro Foods Pvt Ltd" },
      { label: "Desk reports to", value: "Sunita Patil, Finance Head" },
      { label: "Banks", value: "3" },
      { label: "Fund-based limits", value: "₹4.2 crore" },
      { label: "Term debt outstanding", value: "₹1.85 crore" },
      { label: "FX exposure", value: "USD receivables, 60 to 90 days" },
      { label: "Next review", value: "15 Jan 2027" },
    ],
    activity: [
      { on: "2026-10-07", by: "Arvind Menon", text: "Renewal file for the cash-credit limit started. Stock statement requested." },
      { on: "2026-10-05", by: "Sunita Patil", text: "Filed provisional financials for H1 FY 2026–27." },
      { on: "2026-08-01", by: "Arvind Menon", text: "Desk live. First daily position sheet sent." },
      { on: "2026-07-28", by: "Sunita Patil", text: "Board approved the treasury policy." },
      { on: "2026-07-03", by: "Arvind Menon", text: "Position note filed." },
      { on: "2026-06-12", by: "Sunita Patil", text: "Mandate letter signed." },
      { on: "2026-06-08", by: "EasyMarg", text: "File opened." },
    ],
  },
  {
    id: "hl-00431",
    no: "EM/HL/26/00431",
    kind: "home-loan",
    clientId: "c-imran",
    subject: "Row house, Wardha Road, Nagpur",
    amount: 2_400_000,
    amountLabel: "Loan sought",
    stage: 1,
    passed: ["2026-10-03"],
    stageSince: "2026-10-03",
    waitingOn: "you",
    waitingFor: "4 papers still to upload.",
    openedOn: "2026-09-30",
    officer: "Priya Nair",
    facts: [
      { label: "Applicant", value: "Imran Shaikh" },
      { label: "Property", value: "Row house, Wardha Road, Nagpur" },
      { label: "Loan sought", value: "₹24,00,000" },
      { label: "Score at intake", value: "588, CIBIL, 30 Sep 2026" },
      { label: "Marks on report", value: "High card utilisation. 5 enquiries in 4 months." },
    ],
    activity: [
      { on: "2026-10-03", by: "Priya Nair", text: "Credit report read. Reading note filed." },
      { on: "2026-09-30", by: "EasyMarg", text: "File opened." },
    ],
  },
  {
    id: "hl-00427",
    no: "EM/HL/26/00427",
    kind: "home-loan",
    clientId: "c-lakshmi",
    subject: "Plot and construction, Saravanampatti",
    amount: 3_150_000,
    amountLabel: "Loan sought",
    stage: 2,
    passed: ["2026-09-15", "2026-10-01"],
    stageSince: "2026-10-01",
    waitingOn: "easymarg",
    waitingFor: "Shortlist of lenders being prepared.",
    openedOn: "2026-09-11",
    officer: "Dev Malhotra",
    facts: [
      { label: "Applicant", value: "Lakshmi Iyer" },
      { label: "Property", value: "Plot and construction, Saravanampatti, Coimbatore" },
      { label: "Loan sought", value: "₹31,50,000" },
      { label: "Score at intake", value: "No score. New to credit." },
      { label: "Income", value: "Self-employed, tailoring unit. ITR for 2 years." },
    ],
    activity: [
      { on: "2026-10-01", by: "Dev Malhotra", text: "All papers checked. File complete." },
      { on: "2026-09-15", by: "Dev Malhotra", text: "Credit report read. Reading note filed." },
      { on: "2026-09-11", by: "EasyMarg", text: "File opened." },
    ],
  },
  {
    id: "hl-00409",
    no: "EM/HL/26/00409",
    kind: "home-loan",
    clientId: "c-gurpreet",
    subject: "Resale flat, Pakhowal Road, Ludhiana",
    amount: 4_500_000,
    amountLabel: "Loan sought",
    stage: 4,
    passed: ["2026-07-31", "2026-08-14", "2026-08-22", "2026-09-30"],
    stageSince: "2026-09-30",
    waitingOn: "lender",
    waitingFor: "Sanction letter expected from the lender.",
    openedOn: "2026-07-28",
    officer: "Dev Malhotra",
    facts: [
      { label: "Applicant", value: "Gurpreet Sandhu" },
      { label: "Property", value: "Resale flat, Pakhowal Road, Ludhiana" },
      { label: "Loan sought", value: "₹45,00,000" },
      { label: "Score at intake", value: "641, CIBIL, 28 Jul 2026" },
      { label: "Marks on report", value: "1 written-off two-wheeler loan, 2021, since paid." },
    ],
    activity: [
      { on: "2026-09-30", by: "Lender", text: "Appraisal cleared. File moved to sanction." },
      { on: "2026-08-22", by: "Gurpreet Sandhu", text: "Approved the shortlist of 3 lenders." },
      { on: "2026-08-14", by: "Dev Malhotra", text: "All papers checked. File complete." },
      { on: "2026-07-31", by: "Dev Malhotra", text: "Credit report read. Reading note filed." },
      { on: "2026-07-28", by: "EasyMarg", text: "File opened." },
    ],
  },
  {
    id: "hl-00436",
    no: "EM/HL/26/00436",
    kind: "home-loan",
    clientId: "c-joseph",
    subject: "Apartment, Kadri, Mangaluru",
    amount: 1_800_000,
    amountLabel: "Loan sought",
    stage: 0,
    passed: [],
    stageSince: "2026-10-09",
    waitingOn: "easymarg",
    waitingFor: "Credit report to be read.",
    openedOn: "2026-10-09",
    officer: "Priya Nair",
    facts: [
      { label: "Applicant", value: "Joseph Fernandes" },
      { label: "Property", value: "Apartment, Kadri, Mangaluru" },
      { label: "Loan sought", value: "₹18,00,000" },
      { label: "Declared", value: "1 settled personal loan, 2024." },
    ],
    activity: [{ on: "2026-10-09", by: "EasyMarg", text: "File opened." }],
  },
  {
    id: "tr-00034",
    no: "EM/TR/26/00034",
    kind: "treasury",
    clientId: "c-northline",
    subject: "Treasury desk",
    amount: 75_000_000,
    amountLabel: "Limits in scope",
    stage: 1,
    passed: ["2026-09-26"],
    stageSince: "2026-09-26",
    waitingOn: "easymarg",
    waitingFor: "Position note in draft.",
    openedOn: "2026-09-22",
    officer: "Arvind Menon",
    facts: [
      { label: "Company", value: "Northline Logistics LLP" },
      { label: "Banks", value: "4" },
      { label: "Fund-based limits", value: "₹7.5 crore" },
      { label: "Fleet loans", value: "11, across 3 lenders" },
    ],
    activity: [
      { on: "2026-09-26", by: "Northline Logistics LLP", text: "Mandate letter signed." },
      { on: "2026-09-22", by: "EasyMarg", text: "File opened." },
    ],
  },
  {
    id: "tr-00029",
    no: "EM/TR/26/00029",
    kind: "treasury",
    clientId: "c-meenakshi",
    subject: "Treasury desk",
    amount: 120_000_000,
    amountLabel: "Limits in scope",
    stage: 2,
    passed: ["2026-05-23", "2026-06-20"],
    stageSince: "2026-06-20",
    waitingOn: "you",
    waitingFor: "Board to approve the treasury policy.",
    openedOn: "2026-05-19",
    officer: "Arvind Menon",
    facts: [
      { label: "Company", value: "Meenakshi Textiles Pvt Ltd" },
      { label: "Banks", value: "5" },
      { label: "Fund-based limits", value: "₹12 crore" },
      { label: "FX exposure", value: "USD and EUR receivables, 90 days" },
    ],
    activity: [
      { on: "2026-06-20", by: "Arvind Menon", text: "Position note filed. Draft policy sent to the board." },
      { on: "2026-05-23", by: "Meenakshi Textiles Pvt Ltd", text: "Mandate letter signed." },
      { on: "2026-05-19", by: "EasyMarg", text: "File opened." },
    ],
  },
];

type DocSeed = Omit<Doc, "id" | "fileId" | "serial">;

function papers(fileId: string, seeds: DocSeed[]): Doc[] {
  return seeds.map((seed, i) => ({ ...seed, id: `${fileId}-${String(i + 1).padStart(2, "0")}`, fileId, serial: i + 1 }));
}

/** A checklist where the first `verified` papers are checked, the next `filed` are waiting, and the rest are still needed. */
function fromChecklist(fileId: string, kind: Kind, officer: string, on: string, verified: number, filed = 0): Doc[] {
  return papers(
    fileId,
    CHECKLIST[kind].map((item, i): DocSeed => {
      const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
      if (i < verified) {
        return { ...item, status: "verified", filename: `${slug}.pdf`, sizeKb: 180 + i * 137, filedOn: on, filedBy: "client", checkedBy: officer, checkedOn: on };
      }
      if (i < verified + filed) {
        return { ...item, status: "filed", filename: `${slug}.pdf`, sizeKb: 240 + i * 91, filedOn: on, filedBy: "client" };
      }
      return { ...item, status: "needed" };
    }),
  );
}

const docs: Doc[] = [
  ...papers("hl-00418", [
    { title: "PAN card", group: "Identity", status: "verified", filename: "pan-anita.pdf", sizeKb: 212, filedOn: "2026-08-21", filedBy: "client", checkedBy: "Priya Nair", checkedOn: "2026-08-22" },
    { title: "Aadhaar, masked", group: "Identity", status: "verified", filename: "aadhaar-masked.pdf", sizeKb: 340, filedOn: "2026-08-21", filedBy: "client", checkedBy: "Priya Nair", checkedOn: "2026-08-22" },
    { title: "Credit report", group: "Credit", status: "verified", filename: "credit-report-2026-08-21.pdf", sizeKb: 488, filedOn: "2026-08-21", filedBy: "easymarg", checkedBy: "Priya Nair", checkedOn: "2026-08-24" },
    { title: "Credit reading note", group: "Issued", status: "verified", filename: "reading-note.pdf", sizeKb: 96, filedOn: "2026-08-24", filedBy: "easymarg", checkedBy: "Priya Nair", checkedOn: "2026-08-24" },
    { title: "Salary slips, Jun to Aug 2026", group: "Income", status: "verified", filename: "salary-slips-jun-aug.pdf", sizeKb: 610, filedOn: "2026-08-27", filedBy: "client", checkedBy: "Priya Nair", checkedOn: "2026-08-28" },
    { title: "Form 16, FY 2024–25 and 2025–26", group: "Income", status: "verified", filename: "form-16-two-years.pdf", sizeKb: 1320, filedOn: "2026-08-27", filedBy: "client", checkedBy: "Priya Nair", checkedOn: "2026-08-28" },
    {
      title: "Bank statements, last 12 months",
      group: "Banking",
      status: "reupload",
      accepts: "Every account where salary or EMIs move. One unlocked PDF per account, not screenshots.",
      filename: "savings-statement.pdf",
      sizeKb: 2890,
      filedOn: "2026-09-02",
      filedBy: "client",
      issues: [
        { label: "Pages missing", detail: "The statement jumps from 14 Mar to 02 May 2026. Download the full 12 months as one file." },
        { label: "PDF is locked", detail: "The lender cannot open password-protected files. Download an unlocked copy from net banking, or print it to PDF." },
      ],
    },
    { title: "Explanation letter, missed EMIs of 2023", group: "Credit", status: "verified", filename: "explanation-letter-signed.pdf", sizeKb: 142, filedOn: "2026-09-04", filedBy: "client", checkedBy: "Priya Nair", checkedOn: "2026-09-05" },
    { title: "No-dues certificate, personal loan", group: "Credit", status: "filed", filename: "no-dues-certificate.pdf", sizeKb: 188, filedOn: "2026-10-08", filedBy: "client" },
    { title: "Agreement to sale", group: "Property", status: "verified", filename: "agreement-to-sale.pdf", sizeKb: 3410, filedOn: "2026-09-05", filedBy: "client", checkedBy: "Priya Nair", checkedOn: "2026-09-09" },
    { title: "Co-applicant PAN and Aadhaar", group: "Identity", status: "verified", filename: "co-applicant-kyc.pdf", sizeKb: 520, filedOn: "2026-09-05", filedBy: "client", checkedBy: "Priya Nair", checkedOn: "2026-09-09" },
    { title: "Lender shortlist and your consent", group: "Issued", status: "verified", filename: "shortlist-consent-signed.pdf", sizeKb: 118, filedOn: "2026-09-18", filedBy: "easymarg", checkedBy: "Priya Nair", checkedOn: "2026-09-18" },
    { title: "Property tax receipt, current year", group: "Property", status: "needed", accepts: "This year's receipt, in the seller's name. The lender's lawyer asked for it." },
  ]),
  ...papers("tr-00031", [
    { title: "Certificate of incorporation", group: "Company", status: "verified", filename: "certificate-of-incorporation.pdf", sizeKb: 410, filedOn: "2026-06-08", filedBy: "client", checkedBy: "Arvind Menon", checkedOn: "2026-06-09" },
    { title: "Board resolution appointing EasyMarg", group: "Company", status: "verified", filename: "board-resolution.pdf", sizeKb: 132, filedOn: "2026-06-10", filedBy: "client", checkedBy: "Arvind Menon", checkedOn: "2026-06-10" },
    { title: "Mandate letter", group: "Issued", status: "verified", filename: "mandate-letter-signed.pdf", sizeKb: 204, filedOn: "2026-06-12", filedBy: "easymarg", checkedBy: "Arvind Menon", checkedOn: "2026-06-12" },
    { title: "Audited financials, FY 2024–25 and 2025–26", group: "Company", status: "verified", filename: "audited-financials.pdf", sizeKb: 5120, filedOn: "2026-06-15", filedBy: "client", checkedBy: "Arvind Menon", checkedOn: "2026-06-18" },
    { title: "Sanction letters for existing limits", group: "Banking", status: "verified", filename: "sanction-letters.pdf", sizeKb: 2240, filedOn: "2026-06-15", filedBy: "client", checkedBy: "Arvind Menon", checkedOn: "2026-06-18" },
    { title: "Bank statements, all accounts, 12 months", group: "Banking", status: "verified", filename: "statements-all-accounts.zip", sizeKb: 14300, filedOn: "2026-06-17", filedBy: "client", checkedBy: "Arvind Menon", checkedOn: "2026-06-24" },
    { title: "Position note", group: "Issued", status: "verified", filename: "position-note.pdf", sizeKb: 380, filedOn: "2026-07-03", filedBy: "easymarg", checkedBy: "Arvind Menon", checkedOn: "2026-07-03" },
    { title: "Treasury policy, board-approved", group: "Issued", status: "verified", filename: "treasury-policy-signed.pdf", sizeKb: 296, filedOn: "2026-07-28", filedBy: "easymarg", checkedBy: "Arvind Menon", checkedOn: "2026-07-28" },
    { title: "Provisional financials, H1 FY 2026–27", group: "Company", status: "filed", filename: "provisional-h1.xlsx", sizeKb: 264, filedOn: "2026-10-05", filedBy: "client" },
    { title: "Stock statement, September 2026", group: "Company", status: "needed", accepts: "Monthly statement in the bank's format, signed." },
  ]),
  ...fromChecklist("hl-00431", "home-loan", "Priya Nair", "2026-10-04", 2, 1),
  ...fromChecklist("hl-00427", "home-loan", "Dev Malhotra", "2026-09-28", 7),
  ...fromChecklist("hl-00409", "home-loan", "Dev Malhotra", "2026-08-12", 7),
  ...fromChecklist("hl-00436", "home-loan", "Priya Nair", "2026-10-09", 0, 2),
  ...fromChecklist("tr-00034", "treasury", "Arvind Menon", "2026-09-28", 4, 2),
  ...fromChecklist("tr-00029", "treasury", "Arvind Menon", "2026-06-02", 7),
];

export const SEED: DemoState = { session: null, clients, files, docs };

export const DEMO_CUSTOMERS = {
  individual: "c-anita",
  company: "c-kaveri",
} as const;
