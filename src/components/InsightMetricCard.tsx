"use client";

interface InsightMetricCardProps {
  title: string;
  value: string;
  health: "green" | "amber" | "red";
  insight: string;
  subMetric?: string;
}

export default function InsightMetricCard({
  title,
  value,
  health,
  insight,
  subMetric,
}: InsightMetricCardProps) {
  const stripeColor =
    health === "green"
      ? "bg-teal-500"
      : health === "amber"
      ? "bg-amber-400"
      : "bg-rose-500";

  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden card-hover shadow-sm">
      <div className={`h-1 ${stripeColor}`} />
      <div className="p-5">
        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
          {title}
        </span>
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
