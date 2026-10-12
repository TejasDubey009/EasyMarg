/*
  Copy shared by the three showcase landing pages. Same positioning as the
  live site: EasyMarg is a financial services destination; the two desks open
  today are home loans after a decline and treasury for growing companies.
  Nothing here is a statistic, a testimonial or a logo.
*/

import { ROAD } from "@/lib/data";

export const BRAND = {
  name: "EasyMarg",
  meaning: "Marg · मार्ग · a road; a way through",
  email: "support@easymarg.com",
  phone: "+91 99309 19980",
  phoneHref: "tel:+919930919980",
  city: "Bengaluru, Karnataka, India",
  company: "GetProTech Solutions Private Limited",
  disclaimer:
    "EasyMarg prepares and represents your case; it does not lend, and it never holds or moves your money. Every loan and every limit is sanctioned at the sole discretion of the lending institution. Nothing on this site is a promise of credit.",
};

export const PRINCIPLES = [
  {
    n: "01",
    title: "One officer",
    body: "A named person owns your case from the first paper to the last. You never start again with someone new.",
  },
  {
    n: "02",
    title: "One file",
    body: "Each piece of work gets a file number, a set of milestones and a list of papers. You can see where it stands at any hour.",
  },
  {
    n: "03",
    title: "One record",
    body: "Every paper is checked, numbered and kept for life, across every service you ever use with us.",
  },
];

export const DESKS = [
  {
    audience: "For individuals",
    title: "Home loans after a decline",
    body: "A bank's scorecard said no. That is one lender's answer, not every lender's. We build the file a housing finance company will read in full.",
    who: "Salaried or self-employed applicants with a low score, missed EMIs, a settled account, or no credit history at all.",
    get: "A straight answer on where you stand, then one case officer from the first paper to disbursal.",
    href: "/home-loans",
    milestones: ROAD["home-loan"].length,
  },
  {
    audience: "For companies",
    title: "Treasury for growing companies",
    body: "Five bank accounts, three lenders, a limit up for renewal and dollars due in ninety days. We run that work as your treasury desk.",
    who: "Finance heads managing cash, limits and bank relationships without a treasury team of their own.",
    get: "A desk that reports to your finance head, inside a policy your board has approved.",
    href: "/treasury",
    milestones: ROAD.treasury.length,
  },
];

export const HOME_LOAN_ROAD = ROAD["home-loan"];
export const TREASURY_ROAD = ROAD.treasury;

export const REFUSALS = [
  {
    title: "Promise an outcome.",
    body: "Lenders and banks decide, not us. If your case is not ready we will say so on the first call, and tell you what would make it ready.",
  },
  {
    title: "Act without your say-so.",
    body: "Nothing goes to a lender or a bank until you have seen it and approved it. That includes any enquiry that would be written onto your credit report.",
  },
  {
    title: "Ask for your OTP, PIN or net-banking password.",
    body: "No EasyMarg officer ever will. If someone using our name does, it is not us. Tell us.",
  },
  {
    title: "Leave you guessing.",
    body: "Your file shows where it is, who has it and what it is waiting for. You should never have to call to find out.",
  },
];

/* Facts that are true of the service, written as figures. */
export const FACTS = [
  { value: 1, label: "case officer per file", note: "Named on the file the day it opens." },
  { value: 6, label: "milestones on a home-loan road", note: "From the credit report to disbursal." },
  { value: 5, label: "milestones on a treasury mandate", note: "From the mandate letter to the quarterly review." },
  { value: 0, label: "papers deleted after a file closes", note: "The record is kept for life." },
];

export const RECORD_ROOM = [
  { title: "Kept for life", body: "Nothing is deleted when a file closes. Need a 2026 sanction letter for a balance transfer in 2041? It is where you left it." },
  { title: "Numbered like a file", body: "Paper 07 of file 00418 is written 00418/07, on the register and on every message about it." },
  { title: "Yours to take", body: "Download any paper, or the whole record, whenever you want it. It is your record. We are the ones keeping it." },
];

/* Six lines of a sample register. Invented, like every record in the demo. */
export const REGISTER = [
  { ref: "00418/01", paper: "PAN card", filed: "21 Aug 2026", status: "Checked" },
  { ref: "00418/03", paper: "Credit report", filed: "21 Aug 2026", status: "Checked" },
  { ref: "00418/06", paper: "Form 16, FY 2024–25 and 2025–26", filed: "27 Aug 2026", status: "Checked" },
  { ref: "00418/08", paper: "Explanation letter, missed EMIs of 2023", filed: "04 Sep 2026", status: "Checked" },
  { ref: "00418/10", paper: "Agreement to sale", filed: "05 Sep 2026", status: "Checked" },
  { ref: "00418/12", paper: "Lender shortlist and your consent", filed: "18 Sep 2026", status: "Checked" },
];
