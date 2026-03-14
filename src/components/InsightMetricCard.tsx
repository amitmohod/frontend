"use client";

interface InsightMetricCardProps {
  title: string;
  value: string;
  health: "green" | "amber" | "red";
  insight: string;
  subMetric?: string;
  delta?: number;        // QoQ change (positive = better, negative = worse)
  deltaLabel?: string;   // unit label e.g. "pp" or "%"
  deltaInvert?: boolean; // if true, negative delta = green (e.g. cycle time)
}

export default function InsightMetricCard({
  title,
  value,
  health,
  insight,
  subMetric,
  delta,
  deltaLabel = "pp",
  deltaInvert = false,
}: InsightMetricCardProps) {
  const stripeColor =
    health === "green"
      ? "bg-teal-500"
      : health === "amber"
      ? "bg-amber-400"
      : "bg-rose-500";

  const showDelta = delta !== undefined && delta !== 0;
  const isPositive = deltaInvert ? delta! < 0 : delta! > 0;
  const deltaColor = isPositive ? "text-teal-600 bg-teal-50 ring-teal-200" : "text-rose-600 bg-rose-50 ring-rose-200";
  const deltaSign = delta! > 0 ? "+" : "";
  const deltaDisplay = `${deltaSign}${delta}${deltaLabel}`;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden card-hover shadow-sm">
      <div className={`h-1 ${stripeColor}`} />
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            {title}
          </span>
          {showDelta && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ${deltaColor}`}>
              {deltaDisplay}
            </span>
          )}
        </div>
        <div
          className="text-[28px] font-bold text-stone-900 leading-none mt-3 mb-1.5"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {value}
        </div>
        {subMetric && (
          <div className="text-xs font-medium text-stone-400 mb-2">
            {subMetric}
          </div>
        )}
        <div className="text-[11px] leading-relaxed text-stone-500 mt-2 pt-2 border-t border-stone-100">
          {insight}
        </div>
      </div>
    </div>
  );
}
