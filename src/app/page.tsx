"use client";

import {
  useStrategicSignals,
  useBreakdown,
  useRecentDeals,
  useAIInsight,
} from "@/hooks/useAPI";
import InsightMetricCard from "@/components/InsightMetricCard";
import StrategicSignalCard from "@/components/StrategicSignalCard";
import ConversationSignals from "@/components/ConversationSignals";
import AIInsightBox from "@/components/AIInsightBox";
import {
  SkeletonCard,
  SkeletonChart,
  SkeletonSignalCard,
  SkeletonThemeCard,
} from "@/components/SkeletonLoader";
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
  const { data: signals, isLoading: signalsLoading } = useStrategicSignals();
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

  const kpis = signals?.kpis;

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

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-4 gap-5">
        {signalsLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : kpis ? (
          <>
            <InsightMetricCard
              title="Win Rate"
              value={`${kpis.win_rate}%`}
              health={kpis.win_rate >= 50 ? "green" : kpis.win_rate >= 35 ? "amber" : "red"}
              subMetric={`${kpis.won_deals}W / ${kpis.lost_deals}L`}
              insight={`Best: ${kpis.best_segment.name} (${kpis.best_segment.win_rate}%) | Worst: ${kpis.worst_segment.name} (${kpis.worst_segment.win_rate}%)`}
            />
            <InsightMetricCard
              title="Total Revenue"
              value={`$${(kpis.total_revenue / 1e6).toFixed(1)}M`}
              health={kpis.total_lost_revenue > kpis.total_revenue ? "red" : "amber"}
              subMetric={`$${(kpis.total_lost_revenue / 1e6).toFixed(1)}M lost`}
              insight={`Top leak: ${kpis.top_leak_reason} ($${(kpis.top_leak_amount / 1e6).toFixed(1)}M)`}
            />
            <InsightMetricCard
              title="Avg Deal Size"
              value={`$${(kpis.avg_deal_size / 1000).toFixed(0)}K`}
              health={kpis.sweet_spot_win_rate >= 55 ? "green" : "amber"}
              subMetric={`Sweet spot: ${kpis.sweet_spot_range}`}
              insight={`${kpis.sweet_spot_range} wins at ${kpis.sweet_spot_win_rate}% | ${kpis.large_deal_range} wins at only ${kpis.large_deal_win_rate}%`}
            />
            <InsightMetricCard
              title="Avg Cycle"
              value={`${kpis.avg_cycle_won}d`}
              health={kpis.cycle_drag > 25 ? "red" : kpis.cycle_drag > 15 ? "amber" : "green"}
              subMetric={`Won: ${kpis.avg_cycle_won}d | Lost: ${kpis.avg_cycle_lost}d`}
              insight={`Lost deals drag ${kpis.cycle_drag}d longer — early kill = freed capacity`}
            />
          </>
        ) : null}
      </div>

      {/* Strategic Signals */}
      <div>
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Strategic Signals
        </h2>
        <div className="grid grid-cols-3 gap-5">
          {signalsLoading ? (
            <>
              <SkeletonSignalCard />
              <SkeletonSignalCard />
              <SkeletonSignalCard />
            </>
          ) : signals ? (
            <>
              <StrategicSignalCard
                title="Growth Lever"
                color="teal"
                headline={`${signals.growth_lever.source} converts at ${signals.growth_lever.win_rate}% but is only ${signals.growth_lever.pipeline_pct}% of pipeline`}
                metric={`${signals.growth_lever.win_rate}% win rate`}
                detail={`${signals.growth_lever.total_deals} deals from this source. Doubling investment here could significantly lift overall win rate.`}
              />
              <StrategicSignalCard
                title="Revenue Leak"
                color="rose"
                headline={`Lost $${(signals.revenue_leak.revenue_lost / 1e6).toFixed(1)}M to ${signals.revenue_leak.competitor} across ${signals.revenue_leak.deals_lost} deals`}
                metric={`$${(signals.revenue_leak.revenue_lost / 1e6).toFixed(1)}M lost`}
                detail={`${signals.revenue_leak.competitor} is the top competitive threat by revenue impact. Review battlecard and win-back strategy.`}
              />
              <StrategicSignalCard
                title="ICP Fit"
                color="blue"
                headline={`Only ${signals.icp_fit.icp_match_pct}% of pipeline matches ICP`}
                metric={`${signals.icp_fit.icp_win_rate}% vs ${signals.icp_fit.non_icp_win_rate}%`}
                detail={`ICP deals win at ${signals.icp_fit.icp_win_rate}% vs ${signals.icp_fit.non_icp_win_rate}% for non-ICP. Tightening qualification could lift win rate by ${(signals.icp_fit.icp_win_rate - signals.icp_fit.non_icp_win_rate).toFixed(0)}pp.`}
              />
            </>
          ) : null}
        </div>
      </div>

      {/* Conversation Signals */}
      {signalsLoading ? (
        <div>
          <div className="h-4 w-40 bg-stone-100 rounded-full mb-4 animate-pulse" />
          <div className="grid grid-cols-3 gap-4">
            <SkeletonThemeCard />
            <SkeletonThemeCard />
            <SkeletonThemeCard />
            <SkeletonThemeCard />
            <SkeletonThemeCard />
            <SkeletonThemeCard />
          </div>
        </div>
      ) : signals?.conversation_themes ? (
        <ConversationSignals themes={signals.conversation_themes} />
      ) : null}

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
