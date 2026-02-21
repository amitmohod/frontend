"use client";

import { useState } from "react";
import { useCompetitors, useAIInsight } from "@/hooks/useAPI";
import AIInsightBox from "@/components/AIInsightBox";

function getHeatColor(value: number, metric: string): string {
  if (metric === "win_rate") {
    if (value >= 50) return "bg-emerald-500/30 text-emerald-300";
    if (value >= 35) return "bg-yellow-500/30 text-yellow-300";
    return "bg-red-500/30 text-red-300";
  }
  if (metric === "deals_faced") {
    if (value >= 35) return "bg-red-500/20 text-red-300";
    if (value >= 25) return "bg-yellow-500/20 text-yellow-300";
    return "bg-slate-500/20 text-slate-300";
  }
  return "bg-slate-500/20 text-slate-300";
}

function getThreatLevel(winRate: number): { label: string; color: string } {
  if (winRate < 35) return { label: "HIGH", color: "bg-red-500/20 text-red-400" };
  if (winRate < 50) return { label: "MEDIUM", color: "bg-yellow-500/20 text-yellow-400" };
  return { label: "LOW", color: "bg-emerald-500/20 text-emerald-400" };
}

export default function CompetitorsPage() {
  const { data: competitors } = useCompetitors();
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const { data: aiBriefing, isLoading: aiLoading, error: aiError } = useAIInsight("competitors");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Competitor Intelligence</h1>
        <p className="text-sm text-slate-400 mt-1">
          Head-to-head performance analysis and AI battle cards
        </p>
      </div>

      {/* Heatmap Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-700/50">
          <h3 className="text-sm font-medium text-slate-300">
            Competitor Heatmap
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Color-coded by performance (green = we win, red = we lose)
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Competitor</th>
                <th className="px-5 py-3 font-medium">Threat</th>
                <th className="px-5 py-3 font-medium">Our Win Rate</th>
                <th className="px-5 py-3 font-medium">Deals Faced</th>
                <th className="px-5 py-3 font-medium">Avg Deal Size</th>
                <th className="px-5 py-3 font-medium">Top Loss Reasons</th>
                <th className="px-5 py-3 font-medium">Industries</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {competitors?.map((comp) => {
                const threat = getThreatLevel(comp.win_rate);
                return (
                  <tr
                    key={comp.competitor}
                    className={`hover:bg-slate-800/30 cursor-pointer transition-colors ${
                      selectedCompetitor === comp.competitor
                        ? "bg-indigo-500/5"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedCompetitor(
                        selectedCompetitor === comp.competitor
                          ? null
                          : comp.competitor
                      )
                    }
                  >
                    <td className="px-5 py-3 text-white font-medium">
                      {comp.competitor}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${threat.color}`}
                      >
                        {threat.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-medium ${getHeatColor(
                          comp.win_rate,
                          "win_rate"
                        )}`}
                      >
                        {comp.win_rate}%
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-medium ${getHeatColor(
                          comp.deals_faced,
                          "deals_faced"
                        )}`}
                      >
                        {comp.deals_faced}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-300 text-xs">
                      ${(comp.avg_deal_size / 1000).toFixed(0)}K
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {comp.top_loss_reasons.map((r) => (
                          <span
                            key={r}
                            className="text-[10px] bg-slate-700/50 text-slate-400 px-1.5 py-0.5 rounded"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {comp.industries.slice(0, 3).map((ind) => (
                          <span
                            key={ind}
                            className="text-[10px] bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded"
                          >
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

      {/* Selected Competitor Detail Card */}
      {selectedCompetitor && competitors && (
        <CompetitorDetailCard
          competitor={competitors.find((c) => c.competitor === selectedCompetitor)!}
        />
      )}

      {/* AI Competitor Briefing */}
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
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">
            {competitor.competitor}
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${threat.color}`}>
            {threat.label} THREAT
          </span>
        </div>
        <span className="text-sm text-slate-400">
          {competitor.deals_faced} deals encountered
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Win/Loss Bar */}
        <div>
          <div className="text-xs text-slate-500 mb-2">Head-to-Head Record</div>
          <div className="flex h-3 rounded-full overflow-hidden bg-slate-700">
            <div
              className="bg-emerald-500 transition-all"
              style={{ width: `${winPct}%` }}
            />
            <div
              className="bg-red-500 transition-all"
              style={{ width: `${losePct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs">
            <span className="text-emerald-400">
              {competitor.wins}W ({winPct.toFixed(0)}%)
            </span>
            <span className="text-red-400">
              {competitor.losses}L ({losePct.toFixed(0)}%)
            </span>
          </div>
        </div>

        {/* Top Loss Reasons */}
        <div>
          <div className="text-xs text-slate-500 mb-2">Why We Lose</div>
          <div className="space-y-1">
            {competitor.top_loss_reasons.map((r) => (
              <div key={r} className="text-xs text-red-300 bg-red-500/10 px-2 py-1 rounded">
                {r}
              </div>
            ))}
          </div>
        </div>

        {/* Industries */}
        <div>
          <div className="text-xs text-slate-500 mb-2">Active Industries</div>
          <div className="flex flex-wrap gap-1">
            {competitor.industries.map((ind) => (
              <span
                key={ind}
                className="text-xs bg-indigo-500/10 text-indigo-300 px-2 py-1 rounded"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
