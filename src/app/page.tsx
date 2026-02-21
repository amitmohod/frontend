"use client";

import {
  useOverview,
  useBreakdown,
  useRecentDeals,
  useAIInsight,
} from "@/hooks/useAPI";
import MetricCard from "@/components/MetricCard";
import AIInsightBox from "@/components/AIInsightBox";
import { SkeletonCard, SkeletonChart } from "@/components/SkeletonLoader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
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

export default function OverviewPage() {
  const { data: metrics, isLoading: metricsLoading } = useOverview();
  const { data: industryData } = useBreakdown("industry");
  const { data: recentDeals } = useRecentDeals(8);
  const { data: aiSummary, isLoading: aiLoading, error: aiError } = useAIInsight("win-loss-summary");

  const { data: allDeals } = useRecentDeals(50);
  const lossReasons = allDeals
    ? Object.entries(
        allDeals
          .filter((d) => d.stage === "closedlost" && d.loss_reason)
          .reduce((acc: Record<string, number>, d) => {
            acc[d.loss_reason!] = (acc[d.loss_reason!] || 0) + 1;
            return acc;
          }, {})
      )
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6)
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Dashboard Overview
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          Key metrics and patterns from 175 CRM deals
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5">
        {metricsLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : metrics ? (
          <>
            <MetricCard
              title="Win Rate"
              value={`${metrics.win_rate}%`}
              subtitle={`${metrics.won_deals}W / ${metrics.lost_deals}L`}
              trend={metrics.win_rate > 45 ? "up" : "down"}
            />
            <MetricCard
              title="Total Revenue"
              value={`$${(metrics.total_revenue / 1e6).toFixed(1)}M`}
              subtitle={`${metrics.won_deals} closed-won deals`}
              trend="up"
            />
            <MetricCard
              title="Avg Deal Size"
              value={`$${(metrics.avg_deal_size / 1000).toFixed(0)}K`}
              subtitle="Won deals"
              trend="neutral"
            />
            <MetricCard
              title="Avg Cycle"
              value={`${metrics.avg_cycle_won}d`}
              subtitle={`Won: ${metrics.avg_cycle_won}d | Lost: ${metrics.avg_cycle_lost}d`}
              trend="up"
            />
          </>
        ) : null}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-700 mb-5">
            Win Rate by Industry
          </h3>
          {industryData ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={industryData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11, fill: "#78716C" }}
                  axisLine={{ stroke: "#D6D3D1" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#78716C" }}
                  axisLine={{ stroke: "#D6D3D1" }}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: unknown) => [`${value}%`, "Win Rate"]}
                  cursor={{ fill: "rgba(13, 148, 136, 0.04)" }}
                />
                <Bar dataKey="win_rate" radius={[6, 6, 0, 0]}>
                  {industryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <SkeletonChart />
          )}
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-700 mb-5">
            Top Loss Reasons
          </h3>
          {lossReasons.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={lossReasons}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {lossReasons.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <SkeletonChart />
          )}
          {lossReasons.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
              {lossReasons.map((r, i) => (
                <div key={r.name} className="flex items-center gap-1.5 text-xs text-stone-500">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  {r.name} ({r.value})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Summary */}
      <AIInsightBox
        title="AI Executive Summary"
        content={aiSummary?.content}
        isLoading={aiLoading}
        error={aiError}
        defaultExpanded
      />

      {/* Recent Deals */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-stone-100">
          <h3 className="text-sm font-semibold text-stone-700">Recent Deals</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-stone-400 uppercase tracking-wider bg-stone-50/60">
                <th className="px-6 py-3 font-semibold">Deal</th>
                <th className="px-6 py-3 font-semibold">Company</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Source</th>
                <th className="px-6 py-3 font-semibold">Cycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentDeals?.map((deal) => (
                <tr key={deal.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-3.5 text-stone-700 font-medium truncate max-w-[200px]">
                    {deal.name}
                  </td>
                  <td className="px-6 py-3.5 text-stone-500">
                    {deal.company?.name || "\u2014"}
                  </td>
                  <td className="px-6 py-3.5 text-stone-700 font-medium tabular-nums">
                    ${(deal.amount / 1000).toFixed(0)}K
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        deal.stage === "closedwon"
                          ? "bg-teal-50 text-teal-700 ring-1 ring-teal-200"
                          : "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
                      }`}
                    >
                      {deal.stage === "closedwon" ? "Won" : "Lost"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-stone-500">{deal.deal_source}</td>
                  <td className="px-6 py-3.5 text-stone-500 tabular-nums">{deal.cycle_days}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
