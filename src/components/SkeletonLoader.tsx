"use client";

export function SkeletonCard() {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 animate-pulse shadow-sm">
      <div className="h-3 w-20 bg-stone-100 rounded-full mb-4" />
      <div className="h-7 w-24 bg-stone-100 rounded-lg mb-2" />
      <div className="h-2.5 w-16 bg-stone-50 rounded-full" />
    </div>
  );
}

export function SkeletonChart({ height = "h-64" }: { height?: string }) {
  return (
    <div
      className={`bg-white border border-stone-200 rounded-2xl p-5 animate-pulse shadow-sm ${height}`}
    >
      <div className="h-3 w-32 bg-stone-100 rounded-full mb-5" />
      <div className="flex items-end gap-3 h-[calc(100%-2.5rem)]">
        {[60, 80, 45, 70, 35, 55].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-stone-100 rounded-t-lg"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonSignalCard() {
  return (
    <div className="bg-teal-50/40 border border-stone-200 rounded-2xl p-5 animate-pulse shadow-sm">
      <div className="h-4 w-20 bg-stone-100 rounded-full mb-3" />
      <div className="h-4 w-full bg-stone-100 rounded-lg mb-2" />
      <div className="h-3 w-3/4 bg-stone-50 rounded-full mb-2" />
      <div className="h-3 w-1/2 bg-stone-50 rounded-full" />
    </div>
  );
}

export function SkeletonThemeCard() {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 animate-pulse shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-stone-100" />
        <div className="h-4 w-24 bg-stone-100 rounded-full" />
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-3 w-full bg-stone-50 rounded-full" />
        <div className="h-3 w-3/4 bg-stone-50 rounded-full" />
      </div>
      <div className="bg-stone-50 rounded-lg p-3 mt-3">
        <div className="h-3 w-full bg-stone-100 rounded-full mb-1" />
        <div className="h-3 w-2/3 bg-stone-100 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 animate-pulse shadow-sm">
      <div className="h-3 w-32 bg-stone-100 rounded-full mb-5" />
      <div className="space-y-3.5">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-3 flex-[2] bg-stone-100 rounded-full" />
            <div className="h-3 flex-1 bg-stone-50 rounded-full" />
            <div className="h-3 flex-1 bg-stone-50 rounded-full" />
            <div className="h-3 w-16 bg-stone-50 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
