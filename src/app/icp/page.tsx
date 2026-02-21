"use client";

import { useICP, useAIInsight } from "@/hooks/useAPI";
import AIInsightBox from "@/components/AIInsightBox";

export default function ICPPage() {
  const { data: icp } = useICP();
  const { data: aiICP, isLoading: aiICPLoading, error: aiICPError } = useAIInsight("icp");
  const { data: aiPositioning, isLoading: posLoading, error: posError } = useAIInsight("positioning");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          ICP Builder
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          Data-driven Ideal Customer Profile with AI recommendations
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Data-Driven ICP */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            </div>
            <h3 className="text-sm font-bold text-stone-800">
              Data-Driven ICP
            </h3>
            {icp && (
              <span className="ml-auto text-[11px] font-semibold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full ring-1 ring-teal-200">
                {(icp.confidence * 100).toFixed(0)}% confidence
              </span>
            )}
          </div>

          {icp ? (
            <div className="space-y-3">
              <ICPField label="Target Industries" value={icp.industries.join(", ")} highlight />
              <ICPField label="Company Size" value={icp.employee_range} highlight />
              <ICPField label="Deal Size Sweet Spot" value={icp.deal_size_range} highlight />
              <ICPField label="Buyer Personas" value={icp.buyer_titles.join(", ")} />
              <ICPField label="Best Channels" value={icp.preferred_sources.join(", ")} />
              <ICPField label="Avg Sales Cycle" value={`${icp.avg_cycle_days} days`} />
              <ICPField label="Overall Win Rate" value={`${icp.win_rate}%`} />
            </div>
          ) : (
            <div className="space-y-3 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-stone-50 rounded-xl" />
              ))}
            </div>
          )}
        </div>

        {/* Disqualification Criteria */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            </div>
            <h3 className="text-sm font-bold text-stone-800">
              Disqualification Criteria
            </h3>
          </div>

          <div className="space-y-2.5">
            <DQItem text="Manufacturing or Retail companies with 1000+ employees" severity="high" />
            <DQItem text="Deals over $150K without VP+ executive sponsor" severity="high" />
            <DQItem text="Outbound-sourced deal with Manager-level contact only" severity="medium" />
            <DQItem text="Competitor is ZetaFlow in their stronghold industry" severity="medium" />
            <DQItem text="Sales cycle exceeding 60 days without clear champion" severity="low" />
            <DQItem text="No allocated budget (exploratory only)" severity="low" />
          </div>

          <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-100">
            <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-3">Lead Scoring</h4>
            <div className="space-y-2">
              <ScoreBand label="A-Lead" color="teal" desc="ICP match + Referral + VP+ buyer" rate="80%+" />
              <ScoreBand label="B-Lead" color="blue" desc="Right industry OR right size + decent source" rate="50-80%" />
              <ScoreBand label="C-Lead" color="amber" desc="Mixed signals, one strong factor" rate="30-50%" />
              <ScoreBand label="D-Lead" color="rose" desc="Multiple red flags, deprioritize" rate="<30%" />
            </div>
          </div>
        </div>
      </div>

      <AIInsightBox
        title="AI-Generated Ideal Customer Profile"
        content={aiICP?.content}
        isLoading={aiICPLoading}
        error={aiICPError}
        defaultExpanded
      />

      <AIInsightBox
        title="AI Positioning Recommendations"
        content={aiPositioning?.content}
        isLoading={posLoading}
        error={posError}
      />
    </div>
  );
}

function ICPField({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-3.5 rounded-xl ${highlight ? "bg-teal-50/60 border border-teal-100" : "bg-stone-50 border border-stone-100"}`}>
      <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-sm text-stone-800 font-semibold">{value}</div>
    </div>
  );
}

function DQItem({ text, severity }: { text: string; severity: "high" | "medium" | "low" }) {
  const styles = {
    high: "border-rose-200 bg-rose-50/60 text-rose-700",
    medium: "border-amber-200 bg-amber-50/60 text-amber-700",
    low: "border-stone-200 bg-stone-50 text-stone-600",
  };
  const badges = {
    high: "bg-rose-100 text-rose-600 ring-1 ring-rose-200",
    medium: "bg-amber-100 text-amber-600 ring-1 ring-amber-200",
    low: "bg-stone-100 text-stone-500 ring-1 ring-stone-200",
  };

  return (
    <div className={`p-3 rounded-xl border ${styles[severity]} flex items-start gap-2.5`}>
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 mt-0.5 ${badges[severity]}`}>
        {severity.toUpperCase()}
      </span>
      <span className="text-xs leading-relaxed">{text}</span>
    </div>
  );
}

function ScoreBand({ label, color, desc, rate }: { label: string; color: string; desc: string; rate: string }) {
  const colorMap: Record<string, string> = {
    teal: "bg-teal-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };

  return (
    <div className="flex items-center gap-2.5 text-xs">
      <div className={`w-2 h-2 rounded-full ${colorMap[color]}`} />
      <span className="text-stone-700 font-bold w-14">{label}</span>
      <span className="text-stone-400 flex-1">{desc}</span>
      <span className="text-stone-500 font-medium tabular-nums">{rate}</span>
    </div>
  );
}
