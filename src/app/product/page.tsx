"use client";

import { useState } from "react";
import { useProductLine, PRODUCT_LINE_LABELS } from "@/contexts/ProductLineContext";

// ─── Local display type (maps global context values to display labels) ────────
const PRODUCT_LINES = Object.values(PRODUCT_LINE_LABELS) as string[];

const TA_FEATURE_GAPS = [
  {
    id: 1,
    name: "IDE / Code Replay quality",
    deals: 12,
    revenue: 480000,
    competitors: ["HackerRank"],
    quote: '"Their coding environment felt more like a real IDE. Ours felt like a text box."',
    quoteContext: "Lost deal · IT Services · $52K",
  },
  {
    id: 2,
    name: "Coding question library depth",
    deals: 9,
    revenue: 360000,
    competitors: ["HackerRank", "Codility"],
    quote: '"HackerRank had 3x more questions across niche languages we needed."',
    quoteContext: "Lost deal · Product/SaaS · $44K",
  },
  {
    id: 3,
    name: "ATS integration gaps",
    deals: 8,
    revenue: 320000,
    competitors: ["Multiple"],
    quote: '"We needed a native Greenhouse integration — not a Zapier workaround."',
    quoteContext: "Lost deal · BFSI · $38K",
  },
  {
    id: 4,
    name: "AI proctoring accuracy",
    deals: 6,
    revenue: 240000,
    competitors: ["HireVue"],
    quote: '"HireVue\'s false-positive rate was lower. Candidates were complaining about ours."',
    quoteContext: "Lost deal · Healthcare · $41K",
  },
  {
    id: 5,
    name: "Candidate-facing UX",
    deals: 5,
    revenue: 200000,
    competitors: ["TestGorilla"],
    quote: '"TestGorilla looked polished and modern. Our candidates noticed the difference."',
    quoteContext: "Lost deal · IT Services · $31K",
  },
];

const SI_FEATURE_GAPS = [
  {
    id: 1,
    name: "Skills ontology depth & accuracy",
    deals: 14,
    revenue: 620000,
    competitors: ["Eightfold AI"],
    quote: '"Eightfold\'s skills graph was significantly richer. They had 5 years of training data on us."',
    quoteContext: "Lost deal · BFSI · $68K",
  },
  {
    id: 2,
    name: "Workday / SAP HCM integration",
    deals: 11,
    revenue: 520000,
    competitors: ["Eightfold AI", "Gloat"],
    quote: '"We needed certified Workday integration. Not an API — a certified connector."',
    quoteContext: "Lost deal · Healthcare · $55K",
  },
  {
    id: 3,
    name: "Internal mobility workflow automation",
    deals: 8,
    revenue: 380000,
    competitors: ["Gloat"],
    quote: '"Gloat had built-in job posting to internal talent pool. We had to build that manually."',
    quoteContext: "Lost deal · Manufacturing · $49K",
  },
  {
    id: 4,
    name: "Board-level workforce analytics",
    deals: 6,
    revenue: 290000,
    competitors: ["Eightfold AI"],
    quote: '"The CHRO needed a slide she could show the board. Eightfold had a template for that."',
    quoteContext: "Lost deal · BFSI · $47K",
  },
  {
    id: 5,
    name: "AI skills inference accuracy",
    deals: 5,
    revenue: 240000,
    competitors: ["Eightfold AI", "SkyHive"],
    quote: '"Their AI inferred skills from resumes that were 3 years old with surprising accuracy."',
    quoteContext: "Lost deal · IT Services · $38K",
  },
];

const TA_INTEGRATIONS = [
  { name: "Greenhouse ATS", deals: 6, revenue: 240000, severity: "high" },
  { name: "Workday Recruiting", deals: 4, revenue: 160000, severity: "high" },
  { name: "iCIMS", deals: 3, revenue: 120000, severity: "medium" },
  { name: "Lever", deals: 2, revenue: 80000, severity: "medium" },
];

const SI_INTEGRATIONS = [
  { name: "Workday HCM", deals: 11, revenue: 520000, severity: "high" },
  { name: "SAP SuccessFactors", deals: 7, revenue: 330000, severity: "high" },
  { name: "Oracle HCM", deals: 4, revenue: 190000, severity: "medium" },
  { name: "Cornerstone LMS", deals: 3, revenue: 140000, severity: "medium" },
];

const TA_PERSONAS = [
  {
    title: "VP TA / Head Recruitment",
    winRate: 62,
    health: "green" as const,
    asks: ["ATS integration", "Assessment library breadth", "Candidate experience quality"],
    concern: "Needs proof of validity + bias-free assessments for EEOC compliance.",
  },
  {
    title: "TA Manager",
    winRate: 28,
    health: "red" as const,
    asks: ["Pricing flexibility", "Easy setup (no IT)", "Reporting & export"],
    concern: "Budget-constrained. Needs to justify purchase to VP without procurement.",
  },
];

const SI_PERSONAS = [
  {
    title: "CHRO / CPO",
    winRate: 60,
    health: "green" as const,
    asks: ["Board-level reporting", "ROI quantification", "HCM integration"],
    concern: "Must justify skills investment to board. Needs data to show workforce readiness.",
  },
  {
    title: "Head of L&D",
    winRate: 35,
    health: "amber" as const,
    asks: ["LMS integration", "Skill gap visualisation", "Upskilling ROI tracking"],
    concern: "Owns learning budget but lacks authority to sign enterprise deals alone.",
  },
];

const TA_COMPETITORS = [
  {
    name: "HackerRank",
    threat: "HIGH",
    winRate: 25,
    capabilities: [
      { label: "Code replay", count: 12 },
      { label: "Question library", count: 9 },
      { label: "IDE realism", count: 7 },
      { label: "Enterprise pricing", count: 5 },
    ],
  },
  {
    name: "HireVue",
    threat: "MED",
    winRate: 38,
    capabilities: [
      { label: "Video AI scoring", count: 8 },
      { label: "Enterprise ATS", count: 6 },
      { label: "Brand recognition", count: 4 },
    ],
  },
  {
    name: "Codility",
    threat: "MED",
    winRate: 42,
    capabilities: [
      { label: "Question library", count: 7 },
      { label: "Competitive pricing", count: 6 },
      { label: "API quality", count: 4 },
    ],
  },
];

const SI_COMPETITORS = [
  {
    name: "Eightfold AI",
    threat: "HIGH",
    winRate: 28,
    capabilities: [
      { label: "Skills ontology depth", count: 14 },
      { label: "AI inference accuracy", count: 11 },
      { label: "Talent intelligence", count: 8 },
      { label: "Market data breadth", count: 6 },
    ],
  },
  {
    name: "Gloat",
    threat: "MED",
    winRate: 35,
    capabilities: [
      { label: "Internal mobility UX", count: 9 },
      { label: "Job marketplace", count: 7 },
      { label: "HCM integrations", count: 5 },
    ],
  },
  {
    name: "Lightcast",
    threat: "LOW",
    winRate: 55,
    capabilities: [
      { label: "Labour market data", count: 6 },
      { label: "Skills taxonomy", count: 4 },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtK(n: number) {
  return `$${Math.round(n / 1000)}K`;
}

function threatStyle(t: string) {
  if (t === "HIGH") return "bg-rose-50 text-rose-600 ring-1 ring-rose-200";
  if (t === "MED") return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  return "bg-teal-50 text-teal-700 ring-1 ring-teal-200";
}

function severityDot(s: string) {
  return s === "high" ? "bg-rose-500" : "bg-amber-400";
}

function healthStyle(h: "green" | "amber" | "red") {
  if (h === "green") return "bg-teal-50 text-teal-700 ring-1 ring-teal-200";
  if (h === "amber") return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  return "bg-rose-50 text-rose-600 ring-1 ring-rose-200";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeatureGapRadar({
  gaps,
  productLine,
}: {
  gaps: typeof TA_FEATURE_GAPS;
  productLine: string;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const max = gaps[0].revenue;
  const total = gaps.reduce((s, g) => s + g.revenue, 0);

  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3
            className="text-sm font-bold text-stone-800"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Feature Gap Radar
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Named product gaps from lost {productLine} deals · ranked by revenue at risk
          </p>
        </div>
        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-200 shrink-0">
          {fmtK(total)} total at risk
        </span>
      </div>

      <div className="divide-y divide-stone-100">
        {gaps.map((gap) => {
          const isOpen = expanded === gap.id;
          const barPct = (gap.revenue / max) * 100;
          return (
            <div key={gap.id}>
              <button
                className="w-full text-left px-6 py-4 hover:bg-stone-50/60 transition-colors"
                onClick={() => setExpanded(isOpen ? null : gap.id)}
              >
                <div className="flex flex-wrap items-center gap-3 mb-2.5">
                  <span className="text-sm font-semibold text-stone-800 flex-1 min-w-0">
                    {gap.name}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                      {gap.deals} deals
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-200">
                      {fmtK(gap.revenue)}
                    </span>
                    {gap.competitors.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 hidden sm:inline-flex"
                      >
                        vs {c}
                      </span>
                    ))}
                    <svg
                      className={`w-4 h-4 text-stone-300 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-500 transition-all duration-500"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 tabular-nums shrink-0 w-10 text-right">
                    {Math.round(barPct)}%
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-4 -mt-1">
                  <div className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3">
                    <p className="text-sm text-stone-600 italic leading-relaxed">
                      {gap.quote}
                    </p>
                    <p className="text-[11px] text-stone-400 mt-1.5 font-medium">
                      {gap.quoteContext}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function IntegrationGapTracker({
  integrations,
}: {
  integrations: typeof TA_INTEGRATIONS;
}) {
  const total = integrations.reduce((s, i) => s + i.revenue, 0);
  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm flex flex-col">
      <div className="px-6 py-4 border-b border-stone-100">
        <h3
          className="text-sm font-bold text-stone-800"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Integration Gap Tracker
        </h3>
        <p className="text-xs text-stone-400 mt-0.5">Integrations cited in lost deals</p>
      </div>
      <div className="flex-1 divide-y divide-stone-100">
        {integrations.map((item) => (
          <div
            key={item.name}
            className="px-6 py-3.5 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${severityDot(item.severity)}`}
              />
              <span className="text-sm font-semibold text-stone-700 truncate">
                {item.name}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-semibold text-stone-400">
                {item.deals} deals
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-200">
                {fmtK(item.revenue)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-3 border-t border-stone-100 bg-stone-50/60 rounded-b-2xl">
        <p className="text-[11px] font-semibold text-stone-500">
          Total:{" "}
          <span className="text-rose-600 font-bold">{fmtK(total)}</span> in
          blocked pipeline
        </p>
      </div>
    </div>
  );
}

type Persona = { title: string; winRate: number; health: "green" | "amber" | "red"; asks: string[]; concern: string };

function BuyerPersonaMap({
  personas,
}: {
  personas: Persona[];
}) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm flex flex-col">
      <div className="px-6 py-4 border-b border-stone-100">
        <h3
          className="text-sm font-bold text-stone-800"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Buyer Persona Needs Map
        </h3>
        <p className="text-xs text-stone-400 mt-0.5">What each buyer type asks for</p>
      </div>
      <div className="flex-1 divide-y divide-stone-100">
        {personas.map((p) => (
          <div key={p.title} className="px-6 py-4">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span
                className="text-sm font-bold text-stone-800"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {p.title}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${healthStyle(p.health)}`}
              >
                {p.winRate}% win
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {p.asks.map((ask) => (
                <span
                  key={ask}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-100"
                >
                  {ask}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed italic">
              {p.concern}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompetitorCapabilityMap({
  competitors,
  productLine,
}: {
  competitors: typeof TA_COMPETITORS;
  productLine: string;
}) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between gap-3">
        <div>
          <h3
            className="text-sm font-bold text-stone-800"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Competitive Capability Map
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            What competitors win on in {productLine} deals
          </p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 shrink-0">
          {productLine} product line
        </span>
      </div>
      <div className="divide-y divide-stone-100">
        {competitors.map((comp) => (
          <div key={comp.name} className="px-6 py-4">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span
                className="text-sm font-bold text-stone-900"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {comp.name}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${threatStyle(comp.threat)}`}
              >
                {comp.threat} THREAT
              </span>
              <span className="text-[11px] font-semibold text-stone-400">
                {comp.winRate}% our win rate
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {comp.capabilities.map((cap) => (
                <span
                  key={cap.label}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-600"
                >
                  {cap.label}
                  <span className="text-[10px] font-bold text-stone-400">
                    ×{cap.count}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIProductBrief({ productLine }: { productLine: string }) {
  const isTA = productLine === "TA" || productLine === "All";

  const brief = isTA
    ? {
        period: "TA · Q4 2024",
        points: [
          { rank: 1, text: "IDE & code replay quality", revenue: "$480K blocked pipeline", context: "12 deals vs HackerRank" },
          { rank: 2, text: "ATS integration completeness", revenue: "$400K across 14 deals", context: "Greenhouse, Workday, iCIMS" },
          { rank: 3, text: "Assessment library expansion", revenue: "$360K", context: "vs HackerRank / Codility" },
        ],
        emerging: "AI proctoring accuracy concerns increased in Q4. HireVue is actively repositioning on integrity guarantees. Recommend a proactive product response before Q1 pipeline opens.",
        opportunity: "HackerRank dominates IT Services but shows weakness in BFSI (only 2 competitive encounters). TA product has an untapped vertical advantage in BFSI — worth a targeted go-to-market push.",
      }
    : {
        period: "SI · Q4 2024",
        points: [
          { rank: 1, text: "Skills ontology depth & accuracy", revenue: "$620K blocked pipeline", context: "14 deals vs Eightfold AI" },
          { rank: 2, text: "Workday / SAP HCM integration", revenue: "$520K across 18 deals", context: "Certified connector required" },
          { rank: 3, text: "Internal mobility workflow automation", revenue: "$380K", context: "vs Gloat" },
        ],
        emerging: "CHRO buyers are increasingly asking for board-ready reporting slides. Eightfold is winning on narrative as much as product. Consider a CPO-level reporting template as a quick win.",
        opportunity: "Eightfold AI is strong in large enterprises (5000+ employees) but weak in BFSI mid-market (1000–5000 employees). SI has an opening to dominate this segment with targeted case studies.",
      };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3
            className="text-sm font-bold text-stone-800"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            AI Product Intelligence Brief
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Generated for product planning · {brief.period}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-500">
            {brief.period}
          </span>
          <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        <div>
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-3">
            Top 3 roadmap investments by revenue impact
          </p>
          <div className="space-y-2.5">
            {brief.points.map((p) => (
              <div
                key={p.rank}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-100"
              >
                <span className="text-[11px] font-bold text-stone-400 mt-0.5 w-4 shrink-0">
                  {p.rank}.
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-stone-800">
                    {p.text}
                  </span>
                  <span className="text-[11px] text-stone-400 ml-2">
                    {p.context}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-teal-700 shrink-0">
                  {p.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1.5">
            Emerging Pattern
          </p>
          <p className="text-[12px] text-stone-700 leading-relaxed">{brief.emerging}</p>
        </div>

        <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200">
          <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-1.5">
            Opportunity
          </p>
          <p className="text-[12px] text-stone-700 leading-relaxed">{brief.opportunity}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductIntelligencePage() {
  const { productLine, setProductLine } = useProductLine();

  const activeLabel = PRODUCT_LINE_LABELS[productLine];
  const isTA = productLine === "TA" || productLine === "all";
  const featureGaps = isTA ? TA_FEATURE_GAPS : SI_FEATURE_GAPS;
  const integrations = isTA ? TA_INTEGRATIONS : SI_INTEGRATIONS;
  const personas = isTA ? TA_PERSONAS : SI_PERSONAS;
  const competitors = isTA ? TA_COMPETITORS : SI_COMPETITORS;
  const displayLine = productLine === "all" ? "TA" : activeLabel;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold text-stone-900"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Product Intelligence
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          Feature gaps, competitive signals, and roadmap inputs from 175 CRM deals
        </p>

        {/* Product line selector — mirrors the global state, hidden on mobile since AppShell header shows it */}
        <div className="hidden lg:flex items-center gap-1.5 mt-4 bg-stone-100 p-1 rounded-xl w-fit">
          {PRODUCT_LINES.map((pl) => (
            <button
              key={pl}
              onClick={() => setProductLine(
                Object.entries(PRODUCT_LINE_LABELS).find(([, v]) => v === pl)?.[0] as typeof productLine ?? "all"
              )}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeLabel === pl
                  ? "bg-white text-stone-800 shadow-sm"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              {pl}
            </button>
          ))}
        </div>
      </div>

      {/* Full Platform placeholder */}
      {productLine === "full_platform" && (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-stone-700 mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Full Platform view coming soon
          </h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Full Platform deals bundle TA and SI. This view will show cross-product gap analysis and bundling win patterns.
          </p>
        </div>
      )}

      {productLine !== "full_platform" && (
        <>
          {/* Feature Gap Radar */}
          <FeatureGapRadar gaps={featureGaps} productLine={displayLine} />

          {/* Integration + Persona */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <IntegrationGapTracker integrations={integrations} />
            <BuyerPersonaMap personas={personas} />
          </div>

          {/* Competitive Capability Map */}
          <CompetitorCapabilityMap
            competitors={competitors}
            productLine={displayLine}
          />

          {/* AI Brief */}
          <AIProductBrief productLine={activeLabel} />
        </>
      )}
    </div>
  );
}
