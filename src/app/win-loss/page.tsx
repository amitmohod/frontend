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

const COLORS = ["#0D9488", "#2563EB", "#D946EF", "#F59E0B", "#6366F1", "#EC4899"];
const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #E7E5E4",
  borderRadius: "12px",
  fontSize: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Win/Loss Analysis
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          Break down win rates across multiple dimensions
        </p>
      </div>

      {/* Dimension Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-fit">
        {DIMENSIONS.map((d) => (
          <button
            key={d.key}
            onClick={() => setDimension(d.key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              dimension === d.key
                ? "bg-white text-stone-800 shadow-sm"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Breakdown Chart + Table */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-700 mb-5">
            Win Rate by {DIMENSIONS.find((d) => d.key === dimension)?.label}
          </h3>
          {breakdown ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={breakdown} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#78716C" }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 100]}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={100}
                  tick={{ fontSize: 11, fill: "#78716C" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: unknown) => [`${value}%`, "Win Rate"]}
                  cursor={{ fill: "rgba(13, 148, 136, 0.04)" }}
                />
                <Bar dataKey="win_rate" radius={[0, 6, 6, 0]} barSize={24}>
                  {breakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-stone-100">
            <h3 className="text-sm font-semibold text-stone-700">
              Detailed Breakdown
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-stone-400 uppercase tracking-wider bg-stone-50/60">
                  <th className="px-5 py-2.5 font-semibold">Category</th>
                  <th className="px-5 py-2.5 font-semibold">Win Rate</th>
                  <th className="px-5 py-2.5 font-semibold">W/L</th>
                  <th className="px-5 py-2.5 font-semibold">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {[...(breakdown || [])]
                  .sort((a, b) => b.win_rate - a.win_rate)
                  .map((item) => (
                    <tr key={item.category} className="hover:bg-stone-50/50">
                      <td className="px-5 py-3 text-stone-700 font-medium">
                        {item.category}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-20 h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-teal-500"
                              style={{ width: `${item.win_rate}%` }}
                            />
                          </div>
                          <span className="text-stone-600 text-xs font-medium tabular-nums">
                            {item.win_rate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-stone-500 text-xs tabular-nums">
                        {item.won}W / {item.lost}L
                      </td>
                      <td className="px-5 py-3 text-stone-500 text-xs tabular-nums">
                        ${(item.total_revenue / 1000).toFixed(0)}K
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AIInsightBox
        title="AI Win/Loss Analysis"
        content={aiInsight?.content}
        isLoading={aiLoading}
        error={aiError}
      />

      {/* Deal Table */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-stone-700">All Deals</h3>
          <div className="flex gap-1 bg-stone-100 p-0.5 rounded-lg">
            {["", "closedwon", "closedlost"].map((stage) => (
              <button
                key={stage}
                onClick={() => setStageFilter(stage)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                  stageFilter === stage
                    ? "bg-white text-stone-700 shadow-sm"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {stage === "" ? "All" : stage === "closedwon" ? "Won" : "Lost"}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-stone-50 z-10">
              <tr className="text-left text-[11px] text-stone-400 uppercase tracking-wider">
                <th className="px-5 py-2.5 font-semibold">Deal</th>
                <th className="px-5 py-2.5 font-semibold">Amount</th>
                <th className="px-5 py-2.5 font-semibold">Status</th>
                <th className="px-5 py-2.5 font-semibold">Source</th>
                <th className="px-5 py-2.5 font-semibold">Competitor</th>
                <th className="px-5 py-2.5 font-semibold">Cycle</th>
                <th className="px-5 py-2.5 font-semibold">Loss Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {deals?.slice(0, 50).map((deal) => (
                <tr key={deal.id} className="hover:bg-stone-50/50">
                  <td className="px-5 py-2.5 text-stone-700 text-xs font-medium truncate max-w-[180px]">
                    {deal.name}
                  </td>
                  <td className="px-5 py-2.5 text-stone-600 text-xs tabular-nums">
                    ${(deal.amount / 1000).toFixed(0)}K
                  </td>
                  <td className="px-5 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        deal.stage === "closedwon"
                          ? "bg-teal-50 text-teal-700 ring-1 ring-teal-200"
                          : "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
                      }`}
                    >
                      {deal.stage === "closedwon" ? "Won" : "Lost"}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-stone-500 text-xs">{deal.deal_source}</td>
                  <td className="px-5 py-2.5 text-stone-500 text-xs">{deal.competitor || "\u2014"}</td>
                  <td className="px-5 py-2.5 text-stone-500 text-xs tabular-nums">{deal.cycle_days}d</td>
                  <td className="px-5 py-2.5 text-stone-500 text-xs">{deal.loss_reason || "\u2014"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
