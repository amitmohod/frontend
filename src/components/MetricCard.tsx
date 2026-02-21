"use client";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
}: MetricCardProps) {
  const trendColor =
    trend === "up"
      ? "text-teal-600"
      : trend === "down"
      ? "text-rose-500"
      : "text-stone-400";

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 card-hover shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && <span className="text-stone-300">{icon}</span>}
      </div>
      <div className="text-[28px] font-bold text-stone-900 leading-none mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {value}
      </div>
      {subtitle && (
        <span className={`text-xs font-medium ${trendColor}`}>{subtitle}</span>
      )}
    </div>
  );
}
