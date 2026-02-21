"use client";

export function SkeletonCard() {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 animate-pulse">
      <div className="h-3 w-20 bg-slate-700 rounded mb-3" />
      <div className="h-7 w-24 bg-slate-700 rounded mb-2" />
      <div className="h-2 w-16 bg-slate-700/50 rounded" />
    </div>
  );
}

export function SkeletonChart({ height = "h-64" }: { height?: string }) {
  return (
    <div
      className={`bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 animate-pulse ${height}`}
    >
      <div className="h-3 w-32 bg-slate-700 rounded mb-4" />
      <div className="flex items-end gap-2 h-[calc(100%-2rem)]">
        {[60, 80, 45, 70, 35, 55].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-slate-700/50 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 animate-pulse">
      <div className="h-3 w-32 bg-slate-700 rounded mb-4" />
      <div className="space-y-3">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-3 flex-[2] bg-slate-700/50 rounded" />
            <div className="h-3 flex-1 bg-slate-700/50 rounded" />
            <div className="h-3 flex-1 bg-slate-700/50 rounded" />
            <div className="h-3 w-16 bg-slate-700/50 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
