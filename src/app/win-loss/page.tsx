"use client";

import { useState } from "react";
import { useBreakdown, useDeals, useAIInsight } from "@/hooks/useAPI";
import AIInsightBox from "@/components/AIInsightBox";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#818cf8", "#34d399", "#f472b6", "#fbbf24", "#60a5fa", "#a78bfa"];
const DIMENSIONS = [
  { key: "industry", label: "Industry" },
  { key: "deal_size", label: "Deal Size" },
  { key: "source", label: "Source" },
  { key: "company_size", label: "Company Size" },
  { key: "buyer_title", label: "Buyer Title" },
];

export default function WinLossPage() {
  const [dimension, setDimension] = useState("industry");
  const [stageFilter, setStageFilter] = useState("");
  const { data: breakdown } = useBreakdown(dimension);
  const { data: deals } = useDeals(stageFilter ? { stage: stageFilter } : undefined);
  const { data: aiInsight, isLoading: aiLoading, error: aiError } = useAIInsight("win-loss-summary");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Win/Loss Analysis</h1>
        <p className="text-sm text-slate-400 mt-1">
          Break down win rates across multiple dimensions
        </p>
      </div>

      {/* Dimension Tabs */}
      <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg w-fit">
        {DIMENSIONS.map((d) => (
          <button
            key={d.key}
            onClick={() => setDimension(d.key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              dimension === d.key
                ? "bg-indigo-500/20 text-indigo-300"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Breakdown Chart + Table */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-medium text-slate-300 mb-4">
            Win Rate by {DIMENSIONS.find((d) => d.key === dimension)?.label}
          </h3>
          {breakdown ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={breakdown} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 100]}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={100}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                  formatter={(value: unknown) => [`${value}%`, "Win Rate"]}
                />
                <Bar dataKey="win_rate" radius={[0, 4, 4, 0]} barSize={24}>
                  {breakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </div>

        {/* Stats Table */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700/50">
            <h3 className="text-sm font-medium text-slate-300">
              Detailed Breakdown
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 font-medium">Win Rate</th>
                  <th className="px-4 py-2.5 font-medium">W/L</th>
                  <th className="px-4 py-2.5 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {[...(breakdown || [])]
                  .sort((a, b) => b.win_rate - a.win_rate)
                  .map((item) => (
                    <tr key={item.category} className="hover:bg-slate-800/30">
                      <td className="px-4 py-2.5 text-slate-300 font-medium">
                        {item.category}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-indigo-400"
                              style={{ width: `${item.win_rate}%` }}
                            />
                          </div>
                          <span className="text-slate-300 text-xs">
                            {item.win_rate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-slate-400 text-xs">
                        {item.won}W / {item.lost}L
                      </td>
                      <td className="px-4 py-2.5 text-slate-400 text-xs">
                        ${(item.total_revenue / 1000).toFixed(0)}K
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <AIInsightBox
        title="AI Win/Loss Analysis"
        content={aiInsight?.content}
        isLoading={aiLoading}
        error={aiError}
      />

      {/* Deal Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-300">All Deals</h3>
          <div className="flex gap-1">
            {["", "closedwon", "closedlost"].map((stage) => (
              <button
                key={stage}
                onClick={() => setStageFilter(stage)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  stageFilter === stage
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {stage === "" ? "All" : stage === "closedwon" ? "Won" : "Lost"}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-800">
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-2.5 font-medium">Deal</th>
                <th className="px-4 py-2.5 font-medium">Amount</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Source</th>
                <th className="px-4 py-2.5 font-medium">Competitor</th>
                <th className="px-4 py-2.5 font-medium">Cycle</th>
                <th className="px-4 py-2.5 font-medium">Loss Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {deals?.slice(0, 50).map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-2 text-slate-300 text-xs font-medium truncate max-w-[180px]">
                    {deal.name}
                  </td>
                  <td className="px-4 py-2 text-slate-300 text-xs">
                    ${(deal.amount / 1000).toFixed(0)}K
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        deal.stage === "closedwon"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {deal.stage === "closedwon" ? "Won" : "Lost"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-400 text-xs">{deal.deal_source}</td>
                  <td className="px-4 py-2 text-slate-400 text-xs">
                    {deal.competitor || "\u2014"}
                  </td>
                  <td className="px-4 py-2 text-slate-400 text-xs">{deal.cycle_days}d</td>
                  <td className="px-4 py-2 text-slate-400 text-xs">
                    {deal.loss_reason || "\u2014"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
