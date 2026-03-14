"use client";

interface StrategicSignalCardProps {
  title: string;
  color: "teal" | "rose" | "blue";
  headline: string;
  detail: string;
  metric?: string;
  revenueOpportunity?: string; // e.g. "+$1.2M potential"
}

const colorMap = {
  teal: {
    bg: "bg-teal-50/70",
    border: "border-teal-200",
    title: "text-teal-700",
    badge: "bg-teal-100 text-teal-800",
  },
  rose: {
    bg: "bg-rose-50/70",
    border: "border-rose-200",
    title: "text-rose-700",
    badge: "bg-rose-100 text-rose-800",
  },
  blue: {
    bg: "bg-blue-50/70",
    border: "border-blue-200",
    title: "text-blue-700",
    badge: "bg-blue-100 text-blue-800",
  },
};

export default function StrategicSignalCard({
  title,
  color,
  headline,
  detail,
  metric,
  revenueOpportunity,
}: StrategicSignalCardProps) {
  const c = colorMap[color];

  return (
    <div className={`${c.bg} border ${c.border} rounded-2xl p-5 shadow-sm flex flex-col`}>
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${c.badge}`}
        >
          {title}
        </span>
      </div>
      <div className="text-sm font-semibold text-stone-800 leading-snug mb-2">
        {headline}
      </div>
      {metric && (
        <div
          className={`text-lg font-bold ${c.title} mb-1`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {metric}
        </div>
      )}
      <div className="text-[11px] text-stone-500 leading-relaxed flex-1">{detail}</div>
      {revenueOpportunity && (
        <div className="mt-3 pt-3 border-t border-stone-200/60 flex items-center gap-1.5">
          <svg className="w-3 h-3 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[11px] font-semibold text-teal-700">{revenueOpportunity}</span>
        </div>
      )}
    </div>
  );
}
