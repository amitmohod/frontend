"use client";

interface StrategicSignalCardProps {
  title: string;
  color: "teal" | "rose" | "blue";
  headline: string;
  detail: string;
  metric?: string;
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
}: StrategicSignalCardProps) {
  const c = colorMap[color];

  return (
    <div className={`${c.bg} border ${c.border} rounded-2xl p-5 shadow-sm`}>
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
      <div className="text-[11px] text-stone-500 leading-relaxed">{detail}</div>
    </div>
  );
}
