"use client";

import {
  useStrategicSignals,
  useBreakdown,
  useRecentDeals,
  useAIInsight,
  useTrends,
} from "@/hooks/useAPI";
import { useProductLine } from "@/contexts/ProductLineContext";
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
  AreaChart,
  Area,
  ReferenceLine,
} from "recharts";
import type { StrategicSignals } from "@/lib/types";

const COLORS = ["#0D9488", "#2563EB", "#D946EF", "#F59E0B", "#6366F1", "#EC4899"];

const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #E7E5E4",
  borderRadius: "12px",
  fontSize: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

// ─── Revenue opportunity math ────────────────────────────────────────────────
function computePriorities(signals: StrategicSignals) {
  const totalDeals = signals.kpis.won_deals + signals.kpis.lost_deals;
  const avgDealSize = signals.kpis.avg_deal_size;

  // 1. Growth Lever: double pipeline in best channel
  const leverWins = signals.growth_lever.total_deals * (signals.growth_lever.win_rate / 100);
  const leverOpp = Math.round((leverWins * avgDealSize) / 100000) * 100000;

  // 2. Revenue Leak: recover 40% of competitive losses
  const leakOpp = Math.round((signals.revenue_leak.revenue_lost * 0.4) / 100000) * 100000;

  // 3. ICP Fit: close win rate gap on non-ICP deals
  const nonIcpDeals = totalDeals * (1 - signals.icp_fit.icp_match_pct / 100);
  const icpGap = (signals.icp_fit.icp_win_rate - signals.icp_fit.non_icp_win_rate) / 100;
  const icpOpp = Math.round((nonIcpDeals * icpGap * avgDealSize) / 100000) * 100000;

  const items = [
    {
      label: "Revenue Leak",
      title: `Win back deals lost to ${signals.revenue_leak.competitor}`,
      detail: `${signals.revenue_leak.deals_lost} deals lost · $${(signals.revenue_leak.revenue_lost / 1e6).toFixed(1)}M in lost revenue`,
      action: `Build battlecard & update competitive positioning against ${signals.revenue_leak.competitor}`,
      opp: leakOpp,
    },
    {
      label: "Growth Lever",
      title: `Double down on ${signals.growth_lever.source}`,
      detail: `${signals.growth_lever.win_rate}% win rate · only ${signals.growth_lever.pipeline_pct}% of pipeline today`,
      action: `Increase ${signals.growth_lever.source} investment — highest-converting channel is underrepresented`,
      opp: leverOpp,
    },
    {
      label: "ICP Tightening",
      title: `Stop chasing non-ICP deals`,
      detail: `ICP ${signals.icp_fit.icp_win_rate}% vs non-ICP ${signals.icp_fit.non_icp_win_rate}% win rate · only ${signals.icp_fit.icp_match_pct}% of pipeline is ICP`,
      action: `Tighten lead qualification — redirect effort from low-conversion segments`,
      opp: icpOpp,
    },
  ].sort((a, b) => b.opp - a.opp);

  return items;
}

function fmtOpp(n: number): string {
  if (n >= 1e6) return `+$${(n / 1e6).toFixed(1)}M opportunity`;
  if (n >= 1e3) return `+$${Math.round(n / 1000)}K opportunity`;
  return `+$${n} opportunity`;
}

const URGENCY_STYLES = [
  { dot: "bg-rose-500", badge: "bg-rose-50 text-rose-700 ring-rose-200", rank: "#1" },
  { dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700 ring-amber-200", rank: "#2" },
  { dot: "bg-teal-500", badge: "bg-teal-50 text-teal-700 ring-teal-200", rank: "#3" },
];

// ─── CEO Action Digest ────────────────────────────────────────────────────────
function CEOActionDigest({ signals }: { signals: StrategicSignals }) {
  const priorities = computePriorities(signals);
  const totalOpp = priorities.reduce((sum, p) => sum + p.opp, 0);

  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              CEO Action Digest
            </h2>
            <p className="text-[11px] text-stone-400">3 highest-impact moves · ranked by revenue opportunity</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-teal-700">{fmtOpp(totalOpp).replace("+", "").replace(" opportunity", "")} total</div>
          <div className="text-[10px] text-stone-400">addressable opportunity</div>
        </div>
      </div>

      <div className="divide-y divide-stone-100">
        {priorities.map((p, i) => {
          const style = URGENCY_STYLES[i];
          return (
            <div key={p.label} className="px-6 py-4 flex items-start gap-4">
              <div className="flex items-center gap-2 shrink-0 mt-0.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ${style.badge}`}>
                  {style.rank}
                </span>
                <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-stone-800 mb-0.5">{p.title}</div>
                <div className="text-[11px] text-stone-500 mb-1">{p.detail}</div>
                <div className="text-[11px] text-stone-400 italic">{p.action}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm font-bold text-teal-700">{fmtOpp(p.opp)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Win Rate Trend Chart ─────────────────────────────────────────────────────
function WinRateTrendChart() {
  const { productLine } = useProductLine();
  const { data: trends } = useTrends(productLine);

  if (!trends || trends.length < 2) return null;

  const avg = Math.round(trends.reduce((s, t) => s + t.win_rate, 0) / trends.length);
  const first = trends[0].win_rate;
  const last = trends[trends.length - 1].win_rate;
  const trendDelta = Math.round((last - first) * 10) / 10;
  const improving = trendDelta > 0;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-stone-700">Win Rate Trend</h3>
          <p className="text-xs text-stone-400 mt-0.5">Monthly close rate over {trends.length} months</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-stone-400">{avg}% avg</span>
          <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
            improving ? "bg-teal-50 text-teal-700 ring-1 ring-teal-200" : "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
          }`}>
            {improving ? "▲" : "▼"} {improving ? "+" : ""}{trendDelta}pp trend
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={trends} margin={{ left: -10, right: 10 }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0D9488" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#78716C" }}
            axisLine={{ stroke: "#D6D3D1" }}
            tickLine={false}
            tickFormatter={(v) => v.split(" ")[0]}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#78716C" }}
            axisLine={{ stroke: "#D6D3D1" }}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value: unknown, _name: unknown) => [`${value}%`, "Win Rate"]}
            labelFormatter={(label) => `${label}`}
          />
          <ReferenceLine
            y={avg}
            stroke="#78716C"
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{ value: `Avg ${avg}%`, position: "right", fontSize: 10, fill: "#78716C" }}
          />
          <Area
            type="monotone"
            dataKey="win_rate"
            stroke="#0D9488"
            strokeWidth={2}
            fill="url(#trendGradient)"
            dot={{ r: 3, fill: "#0D9488", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#0D9488" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OverviewPage() {
  const { productLine } = useProductLine();
  const { data: signals, isLoading: signalsLoading } = useStrategicSignals(productLine);
  const { data: industryData } = useBreakdown("industry", { productLine });
  const { data: recentDeals } = useRecentDeals(8, productLine);
  const { data: aiSummary, isLoading: aiLoading, error: aiError } = useAIInsight("win-loss-summary");

  const { data: allDeals } = useRecentDeals(50, productLine);
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
  const comparison = kpis?.comparison;

  // Revenue opportunities (for signal cards)
  const leverOpp = signals
    ? Math.round((signals.growth_lever.total_deals * (signals.growth_lever.win_rate / 100) * (kpis?.avg_deal_size ?? 0)) / 100000) * 100000
    : 0;
  const leakOpp = signals
    ? Math.round((signals.revenue_leak.revenue_lost * 0.4) / 100000) * 100000
    : 0;
  const nonIcpDeals = signals ? (kpis!.won_deals + kpis!.lost_deals) * (1 - signals.icp_fit.icp_match_pct / 100) : 0;
  const icpOpp = signals
    ? Math.round((nonIcpDeals * ((signals.icp_fit.icp_win_rate - signals.icp_fit.non_icp_win_rate) / 100) * (kpis?.avg_deal_size ?? 0)) / 100000) * 100000
    : 0;

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

      {/* CEO Action Digest */}
      {signals && <CEOActionDigest signals={signals} />}
      {signalsLoading && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm animate-pulse">
          <div className="h-4 w-48 bg-stone-100 rounded-full mb-6" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 mb-4">
              <div className="w-8 h-8 bg-stone-100 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-stone-100 rounded-full w-2/3" />
                <div className="h-2.5 bg-stone-100 rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
              delta={comparison?.win_rate_change}
              deltaLabel="pp"
            />
            <InsightMetricCard
              title="Total Revenue"
              value={`$${(kpis.total_revenue / 1e6).toFixed(1)}M`}
              health={kpis.total_lost_revenue > kpis.total_revenue ? "red" : "amber"}
              subMetric={`$${(kpis.total_lost_revenue / 1e6).toFixed(1)}M lost`}
              insight={`Top leak: ${kpis.top_leak_reason} ($${(kpis.top_leak_amount / 1e6).toFixed(1)}M)`}
              delta={comparison?.revenue_change_pct}
              deltaLabel="%"
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
              delta={comparison?.cycle_change}
              deltaLabel="d"
              deltaInvert
            />
          </>
        ) : null}
      </div>

      {/* Strategic Signals */}
      <div>
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Strategic Signals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
                revenueOpportunity={leverOpp > 0 ? fmtOpp(leverOpp) : undefined}
              />
              <StrategicSignalCard
                title="Revenue Leak"
                color="rose"
                headline={`Lost $${(signals.revenue_leak.revenue_lost / 1e6).toFixed(1)}M to ${signals.revenue_leak.competitor} across ${signals.revenue_leak.deals_lost} deals`}
                metric={`$${(signals.revenue_leak.revenue_lost / 1e6).toFixed(1)}M lost`}
                detail={`${signals.revenue_leak.competitor} is the top competitive threat by revenue impact. Review battlecard and win-back strategy.`}
                revenueOpportunity={leakOpp > 0 ? fmtOpp(leakOpp) : undefined}
              />
              <StrategicSignalCard
                title="ICP Fit"
                color="blue"
                headline={`Only ${signals.icp_fit.icp_match_pct}% of pipeline matches ICP`}
                metric={`${signals.icp_fit.icp_win_rate}% vs ${signals.icp_fit.non_icp_win_rate}%`}
                detail={`ICP deals win at ${signals.icp_fit.icp_win_rate}% vs ${signals.icp_fit.non_icp_win_rate}% for non-ICP. Tightening qualification could lift win rate by ${(signals.icp_fit.icp_win_rate - signals.icp_fit.non_icp_win_rate).toFixed(0)}pp.`}
                revenueOpportunity={icpOpp > 0 ? fmtOpp(icpOpp) : undefined}
              />
            </>
          ) : null}
        </div>
      </div>

      {/* Conversation Signals */}
      {signalsLoading ? (
        <div>
          <div className="h-4 w-40 bg-stone-100 rounded-full mb-4 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Win Rate Trend + Charts Row */}
      <WinRateTrendChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
