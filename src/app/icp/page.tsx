"use client";

import { useICP, useAIInsight } from "@/hooks/useAPI";
import AIInsightBox from "@/components/AIInsightBox";

export default function ICPPage() {
  const { data: icp } = useICP();
  const { data: aiICP, isLoading: aiICPLoading, error: aiICPError } = useAIInsight("icp");
  const { data: aiPositioning, isLoading: posLoading, error: posError } = useAIInsight("positioning");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">ICP Builder</h1>
        <p className="text-sm text-slate-400 mt-1">
          Data-driven Ideal Customer Profile with AI recommendations
        </p>
      </div>

      {/* ICP Comparison: Current vs AI Recommended */}
      <div className="grid grid-cols-2 gap-4">
        {/* Current ICP from data */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h3 className="text-sm font-semibold text-white">
              Data-Driven ICP
            </h3>
            {icp && (
              <span className="ml-auto text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full">
                {(icp.confidence * 100).toFixed(0)}% confidence
              </span>
            )}
          </div>

          {icp ? (
            <div className="space-y-4">
              <ICPField
                label="Target Industries"
                value={icp.industries.join(", ")}
                highlight
              />
              <ICPField label="Company Size" value={icp.employee_range} highlight />
              <ICPField label="Deal Size Sweet Spot" value={icp.deal_size_range} highlight />
              <ICPField
                label="Buyer Personas"
                value={icp.buyer_titles.join(", ")}
              />
              <ICPField
                label="Best Channels"
                value={icp.preferred_sources.join(", ")}
              />
              <ICPField
                label="Avg Sales Cycle"
                value={`${icp.avg_cycle_days} days`}
              />
              <ICPField
                label="Overall Win Rate"
                value={`${icp.win_rate}%`}
              />
            </div>
          ) : (
            <div className="space-y-3 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-700/30 rounded" />
              ))}
            </div>
          )}
        </div>

        {/* Disqualification Criteria */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <h3 className="text-sm font-semibold text-white">
              Disqualification Criteria
            </h3>
          </div>

          <div className="space-y-3">
            <DQItem text="Manufacturing or Retail companies with 1000+ employees" severity="high" />
            <DQItem text="Deals over $150K without VP+ executive sponsor" severity="high" />
            <DQItem text="Outbound-sourced deal with Manager-level contact only" severity="medium" />
            <DQItem text="Competitor is ZetaFlow in their stronghold industry" severity="medium" />
            <DQItem text="Sales cycle exceeding 60 days without clear champion" severity="low" />
            <DQItem text="No allocated budget (exploratory only)" severity="low" />
          </div>

          <div className="mt-6 p-3 bg-slate-900/50 rounded-lg">
            <h4 className="text-xs font-medium text-slate-400 mb-2">Lead Scoring</h4>
            <div className="space-y-1.5">
              <ScoreBand label="A-Lead" color="emerald" desc="ICP match + Referral + VP+ buyer" rate="80%+" />
              <ScoreBand label="B-Lead" color="blue" desc="Right industry OR right size + decent source" rate="50-80%" />
              <ScoreBand label="C-Lead" color="yellow" desc="Mixed signals, one strong factor" rate="30-50%" />
              <ScoreBand label="D-Lead" color="red" desc="Multiple red flags, deprioritize" rate="<30%" />
            </div>
          </div>
        </div>
      </div>

      {/* AI ICP Generation */}
      <AIInsightBox
        title="AI-Generated Ideal Customer Profile"
        content={aiICP?.content}
        isLoading={aiICPLoading}
        error={aiICPError}
        defaultExpanded
      />

      {/* AI Positioning Recommendations */}
      <AIInsightBox
        title="AI Positioning Recommendations"
        content={aiPositioning?.content}
        isLoading={posLoading}
        error={posError}
      />
    </div>
  );
}

function ICPField({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`p-3 rounded-lg ${highlight ? "bg-emerald-500/5 border border-emerald-500/10" : "bg-slate-900/30"}`}>
      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-sm text-white font-medium">{value}</div>
    </div>
  );
}

function DQItem({ text, severity }: { text: string; severity: "high" | "medium" | "low" }) {
  const colors = {
    high: "border-red-500/30 bg-red-500/5 text-red-300",
    medium: "border-yellow-500/30 bg-yellow-500/5 text-yellow-300",
    low: "border-slate-500/30 bg-slate-500/5 text-slate-300",
  };
  const badges = {
    high: "bg-red-500/20 text-red-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    low: "bg-slate-500/20 text-slate-400",
  };

  return (
    <div className={`p-3 rounded-lg border ${colors[severity]} flex items-start gap-2`}>
      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 mt-0.5 ${badges[severity]}`}>
        {severity.toUpperCase()}
      </span>
      <span className="text-xs">{text}</span>
    </div>
  );
}

function ScoreBand({
  label,
  color,
  desc,
  rate,
}: {
  label: string;
  color: string;
  desc: string;
  rate: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-400",
    blue: "bg-blue-400",
    yellow: "bg-yellow-400",
    red: "bg-red-400",
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`w-2 h-2 rounded-full ${colorMap[color]}`} />
      <span className="text-white font-medium w-14">{label}</span>
      <span className="text-slate-400 flex-1">{desc}</span>
      <span className="text-slate-500">{rate}</span>
    </div>
  );
}
