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
      ? "text-emerald-400"
      : trend === "down"
      ? "text-red-400"
      : "text-slate-400";

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && <span className="text-slate-500">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      {subtitle && (
        <span className={`text-xs ${trendColor}`}>{subtitle}</span>
      )}
    </div>
  );
}
