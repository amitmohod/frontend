"use client";

import { useState } from "react";
import { useCompetitors, useAIInsight } from "@/hooks/useAPI";
import AIInsightBox from "@/components/AIInsightBox";

function getHeatColor(value: number, metric: string): string {
  if (metric === "win_rate") {
    if (value >= 50) return "bg-teal-50 text-teal-700 ring-1 ring-teal-200";
    if (value >= 35) return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    return "bg-rose-50 text-rose-600 ring-1 ring-rose-200";
  }
  if (metric === "deals_faced") {
    if (value >= 35) return "bg-rose-50 text-rose-600 ring-1 ring-rose-200";
    if (value >= 25) return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    return "bg-stone-50 text-stone-500 ring-1 ring-stone-200";
  }
  return "bg-stone-50 text-stone-500 ring-1 ring-stone-200";
}

function getThreatLevel(winRate: number): { label: string; color: string } {
  if (winRate < 35) return { label: "HIGH", color: "bg-rose-50 text-rose-600 ring-1 ring-rose-200" };
  if (winRate < 50) return { label: "MEDIUM", color: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" };
  return { label: "LOW", color: "bg-teal-50 text-teal-700 ring-1 ring-teal-200" };
}

export default function CompetitorsPage() {
  const { data: competitors } = useCompetitors();
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const { data: aiBriefing, isLoading: aiLoading, error: aiError } = useAIInsight("competitors");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Competitor Intelligence
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          Head-to-head performance analysis and AI battle cards
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-stone-100">
          <h3 className="text-sm font-semibold text-stone-700">Competitor Heatmap</h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Color-coded by performance (green = we win, red = we lose)
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-stone-400 uppercase tracking-wider bg-stone-50/60">
                <th className="px-6 py-3 font-semibold">Competitor</th>
                <th className="px-6 py-3 font-semibold">Threat</th>
                <th className="px-6 py-3 font-semibold">Our Win Rate</th>
                <th className="px-6 py-3 font-semibold">Deals Faced</th>
                <th className="px-6 py-3 font-semibold">Avg Deal Size</th>
                <th className="px-6 py-3 font-semibold">Top Loss Reasons</th>
                <th className="px-6 py-3 font-semibold">Industries</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {competitors?.map((comp) => {
                const threat = getThreatLevel(comp.win_rate);
                return (
                  <tr
                    key={comp.competitor}
                    className={`cursor-pointer transition-colors ${
                      selectedCompetitor === comp.competitor
                        ? "bg-teal-50/40"
                        : "hover:bg-stone-50/50"
                    }`}
                    onClick={() =>
                      setSelectedCompetitor(
                        selectedCompetitor === comp.competitor ? null : comp.competitor
                      )
                    }
                  >
                    <td className="px-6 py-3.5 text-stone-800 font-semibold">{comp.competitor}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${threat.color}`}>
                        {threat.label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getHeatColor(comp.win_rate, "win_rate")}`}>
                        {comp.win_rate}%
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getHeatColor(comp.deals_faced, "deals_faced")}`}>
                        {comp.deals_faced}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-stone-600 text-xs font-medium tabular-nums">
                      ${(comp.avg_deal_size / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {comp.top_loss_reasons.map((r) => (
                          <span key={r} className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-medium">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {comp.industries.slice(0, 3).map((ind) => (
                          <span key={ind} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium ring-1 ring-blue-100">
                            {ind}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCompetitor && competitors && (
        <CompetitorDetailCard
          competitor={competitors.find((c) => c.competitor === selectedCompetitor)!}
        />
      )}

      <AIInsightBox
        title="AI Competitive Intelligence Briefing"
        content={aiBriefing?.content}
        isLoading={aiLoading}
        error={aiError}
        defaultExpanded
      />
    </div>
  );
}

function CompetitorDetailCard({
  competitor,
}: {
  competitor: {
    competitor: string;
    wins: number;
    losses: number;
    win_rate: number;
    deals_faced: number;
    avg_deal_size: number;
    top_loss_reasons: string[];
    industries: string[];
  };
}) {
  const threat = getThreatLevel(competitor.win_rate);
  const winPct = competitor.win_rate;
  const losePct = 100 - competitor.win_rate;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-stone-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {competitor.competitor}
          </h3>
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${threat.color}`}>
            {threat.label} THREAT
          </span>
        </div>
        <span className="text-sm text-stone-400">{competitor.deals_faced} deals encountered</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2.5">Head-to-Head Record</div>
          <div className="flex h-3 rounded-full overflow-hidden bg-stone-100">
            <div className="bg-teal-500 transition-all" style={{ width: `${winPct}%` }} />
            <div className="bg-rose-400 transition-all" style={{ width: `${losePct}%` }} />
          </div>
          <div className="flex justify-between mt-1.5 text-xs font-semibold">
            <span className="text-teal-600">{competitor.wins}W ({winPct.toFixed(0)}%)</span>
            <span className="text-rose-500">{competitor.losses}L ({losePct.toFixed(0)}%)</span>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2.5">Why We Lose</div>
          <div className="space-y-1.5">
            {competitor.top_loss_reasons.map((r) => (
              <div key={r} className="text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg font-medium ring-1 ring-rose-100">
                {r}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2.5">Active Industries</div>
          <div className="flex flex-wrap gap-1.5">
            {competitor.industries.map((ind) => (
              <span key={ind} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-medium ring-1 ring-blue-100">
                {ind}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
