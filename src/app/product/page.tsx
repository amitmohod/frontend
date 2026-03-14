"use client";

import { useState } from "react";
import { useProductLine, PRODUCT_LINE_LABELS } from "@/contexts/ProductLineContext";
import {
  useFeatureGaps,
  useIntegrationGaps,
  usePersonaNeeds,
  useCompetitors,
  useAIInsight,
} from "@/hooks/useAPI";
import type { FeatureGap, IntegrationGap, PersonaNeed, CompetitorMetrics } from "@/lib/types";

// ─── Local display type (maps global context values to display labels) ────────
const PRODUCT_LINES = Object.values(PRODUCT_LINE_LABELS) as string[];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtK(n: number) {
  return `$${Math.round(n / 1000)}K`;
}

function threatStyle(winRate: number) {
  if (winRate < 35) return "bg-rose-50 text-rose-600 ring-1 ring-rose-200";
  if (winRate < 50) return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  return "bg-teal-50 text-teal-700 ring-1 ring-teal-200";
}

function threatLabel(winRate: number) {
  if (winRate < 35) return "HIGH";
  if (winRate < 50) return "MED";
  return "LOW";
}

function severityDot(s: string) {
  return s === "high" ? "bg-rose-500" : "bg-amber-400";
}

function winRateHealth(wr: number): string {
  if (wr >= 50) return "bg-teal-50 text-teal-700 ring-1 ring-teal-200";
  if (wr >= 35) return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  return "bg-rose-50 text-rose-600 ring-1 ring-rose-200";
}

function formatSimpleMarkdown(text: string): string {
  return text
    .replace(/^### (.*$)/gm, '<h3 class="text-base font-bold text-stone-800 mt-3 mb-1">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold text-stone-800 mt-3 mb-1">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="bg-teal-50 px-1.5 py-0.5 rounded-md text-teal-700 text-xs font-medium">$1</code>')
    .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4">$2</li>')
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function SkeletonBlock({ h = "h-32" }: { h?: string }) {
  return (
    <div className={`bg-white border border-stone-200 rounded-2xl shadow-sm ${h} animate-pulse`} />
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeatureGapRadar({
  gaps,
  productLine,
  isLoading,
}: {
  gaps?: FeatureGap[];
  productLine: string;
  isLoading: boolean;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (isLoading) return <SkeletonBlock h="h-64" />;
  if (!gaps || gaps.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-8 text-center">
        <p className="text-sm text-stone-400">No feature gaps found for this product line.</p>
      </div>
    );
  }

  const max = gaps[0].revenue_at_risk;
  const total = gaps.reduce((s, g) => s + g.revenue_at_risk, 0);

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
          const isOpen = expanded === gap.name;
          const barPct = max > 0 ? (gap.revenue_at_risk / max) * 100 : 0;
          return (
            <div key={gap.name}>
              <button
                className="w-full text-left px-6 py-4 hover:bg-stone-50/60 transition-colors"
                onClick={() => setExpanded(isOpen ? null : gap.name)}
              >
                <div className="flex flex-wrap items-center gap-3 mb-2.5">
                  <span className="text-sm font-semibold text-stone-800 flex-1 min-w-0">
                    {gap.name}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                      {gap.deals_affected} deals
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-200">
                      {fmtK(gap.revenue_at_risk)}
                    </span>
                    {gap.competitors.slice(0, 2).map((c) => (
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
                      &ldquo;{gap.sample_quote}&rdquo;
                    </p>
                    <p className="text-[11px] text-stone-400 mt-1.5 font-medium">
                      {gap.sample_quote_context}
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
  isLoading,
}: {
  integrations?: IntegrationGap[];
  isLoading: boolean;
}) {
  if (isLoading) return <SkeletonBlock h="h-56" />;
  if (!integrations || integrations.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-8 text-center">
        <p className="text-sm text-stone-400">No integration gaps found.</p>
      </div>
    );
  }

  const total = integrations.reduce((s, i) => s + i.revenue_at_risk, 0);
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
                {item.deals_affected} deals
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-200">
                {fmtK(item.revenue_at_risk)}
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

function BuyerPersonaMap({
  personas,
  isLoading,
}: {
  personas?: PersonaNeed[];
  isLoading: boolean;
}) {
  if (isLoading) return <SkeletonBlock h="h-56" />;
  if (!personas || personas.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-8 text-center">
        <p className="text-sm text-stone-400">No persona data found.</p>
      </div>
    );
  }

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
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${winRateHealth(p.win_rate)}`}
              >
                {p.win_rate}% win
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {p.top_asks.map((ask) => (
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
  isLoading,
}: {
  competitors?: CompetitorMetrics[];
  productLine: string;
  isLoading: boolean;
}) {
  if (isLoading) return <SkeletonBlock h="h-48" />;
  if (!competitors || competitors.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-8 text-center">
        <p className="text-sm text-stone-400">No competitor data found.</p>
      </div>
    );
  }

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
          <div key={comp.competitor} className="px-6 py-4">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span
                className="text-sm font-bold text-stone-900"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {comp.competitor}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${threatStyle(comp.win_rate)}`}
              >
                {threatLabel(comp.win_rate)} THREAT
              </span>
              <span className="text-[11px] font-semibold text-stone-400">
                {comp.win_rate}% our win rate
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {comp.top_loss_reasons.map((reason, idx) => (
                <span
                  key={`${reason}-${idx}`}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-600"
                >
                  {reason}
                  <span className="text-[10px] font-bold text-stone-400">
                    ×{comp.losses > 0 ? Math.max(1, Math.round(comp.losses / Math.max(comp.top_loss_reasons.length, 1))) : 1}
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

function AIProductBrief({
  content,
  isLoading,
  productLine,
}: {
  content?: string;
  isLoading: boolean;
  productLine: string;
}) {
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
            Generated for product planning · {productLine}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-500">
            {productLine}
          </span>
        </div>
      </div>

      <div className="px-6 py-5">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-3 bg-stone-100 rounded-full w-3/4" />
            <div className="h-3 bg-stone-100 rounded-full w-full" />
            <div className="h-3 bg-stone-100 rounded-full w-2/3" />
            <div className="h-3 bg-stone-100 rounded-full w-1/2 mt-4" />
            <div className="h-3 bg-stone-100 rounded-full w-4/5" />
          </div>
        ) : content ? (
          <div
            className="text-sm text-stone-700 leading-relaxed space-y-2"
            dangerouslySetInnerHTML={{ __html: formatSimpleMarkdown(content) }}
          />
        ) : (
          <p className="text-sm text-stone-400">No brief available.</p>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductIntelligencePage() {
  const { productLine, setProductLine } = useProductLine();

  const activeLabel = PRODUCT_LINE_LABELS[productLine];
  const displayLine = productLine === "all" ? "All Products" : activeLabel;

  const { data: featureGaps, isLoading: gapsLoading } = useFeatureGaps(productLine);
  const { data: integrationGaps, isLoading: intLoading } = useIntegrationGaps(productLine);
  const { data: personaNeeds, isLoading: personaLoading } = usePersonaNeeds(productLine);
  const { data: competitors, isLoading: compLoading } = useCompetitors(productLine);

  const plForBrief = productLine !== "all" ? productLine : undefined;
  const { data: productBrief, isLoading: briefLoading } = useAIInsight(
    "product-brief",
    plForBrief ? { product_line: plForBrief } : {}
  );

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
          <FeatureGapRadar gaps={featureGaps} productLine={displayLine} isLoading={gapsLoading} />

          {/* Integration + Persona */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <IntegrationGapTracker integrations={integrationGaps} isLoading={intLoading} />
            <BuyerPersonaMap personas={personaNeeds} isLoading={personaLoading} />
          </div>

          {/* Competitive Capability Map */}
          <CompetitorCapabilityMap
            competitors={competitors}
            productLine={displayLine}
            isLoading={compLoading}
          />

          {/* AI Brief */}
          <AIProductBrief
            content={productBrief?.content}
            isLoading={briefLoading}
            productLine={displayLine}
          />
        </>
      )}
    </div>
  );
}
