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

const COLORS = ["#818cf8", "#34d399", "#f472b6", "#fbbf24", "#60a5fa", "#a78bfa"];

export default function OverviewPage() {
  const { data: metrics, isLoading: metricsLoading } = useOverview();
  const { data: industryData } = useBreakdown("industry");
  const { data: recentDeals } = useRecentDeals(8);
  const { data: aiSummary, isLoading: aiLoading, error: aiError } = useAIInsight("win-loss-summary");

  // Loss reasons from deals
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-400 mt-1">
          Key metrics and patterns from 175 CRM deals
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
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
      <div className="grid grid-cols-2 gap-4">
        {/* Win Rate by Industry */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-medium text-slate-300 mb-4">
            Win Rate by Industry
          </h3>
          {industryData ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={industryData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={{ stroke: "#475569" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={{ stroke: "#475569" }}
                  tickFormatter={(v) => `${v}%`}
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
                <Bar dataKey="win_rate" radius={[4, 4, 0, 0]}>
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

        {/* Loss Reasons */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-medium text-slate-300 mb-4">
            Top Loss Reasons
          </h3>
          {lossReasons.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={lossReasons}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {lossReasons.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <SkeletonChart />
          )}
          {lossReasons.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {lossReasons.map((r, i) => (
                <div key={r.name} className="flex items-center gap-1.5 text-xs text-slate-400">
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
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-700/50">
          <h3 className="text-sm font-medium text-slate-300">Recent Deals</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Deal</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Source</th>
                <th className="px-5 py-3 font-medium">Cycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {recentDeals?.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3 text-slate-300 font-medium truncate max-w-[200px]">
                    {deal.name}
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {deal.company?.name || "\u2014"}
                  </td>
                  <td className="px-5 py-3 text-slate-300">
                    ${(deal.amount / 1000).toFixed(0)}K
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        deal.stage === "closedwon"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {deal.stage === "closedwon" ? "Won" : "Lost"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{deal.deal_source}</td>
                  <td className="px-5 py-3 text-slate-400">{deal.cycle_days}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
