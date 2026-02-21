"use client";

import type { ConversationThemeAgg } from "@/lib/types";

const THEME_ICONS: Record<string, string> = {
  Pricing: "$",
  "Product Gap": "P",
  Integration: "I",
  "Requirement Mismatch": "R",
  "Champion Risk": "C",
  "Competitive Pressure": "V",
};

const impactColor = {
  High: "bg-rose-100 text-rose-700 ring-rose-200",
  Medium: "bg-amber-100 text-amber-700 ring-amber-200",
  Low: "bg-green-100 text-green-700 ring-green-200",
};

export default function ConversationSignals({
  themes,
}: {
  themes: ConversationThemeAgg[];
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2
          className="text-xs font-bold text-stone-400 uppercase tracking-wider"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Conversation Signals
        </h2>
        <span className="text-[10px] text-stone-400">
          from Fireflies &amp; HubSpot
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {themes.map((t) => (
          <div
            key={t.theme}
            className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-500">
                  {THEME_ICONS[t.theme] || "?"}
                </div>
                <span className="text-sm font-semibold text-stone-800">
                  {t.theme}
                </span>
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${
                  impactColor[t.impact_level]
                }`}
              >
                {t.impact_level} Impact
              </span>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-stone-400">Frequency</span>
                <span className="text-stone-700 font-medium">
                  {t.frequency} deals ({t.deal_pct}%)
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-400">Win rate when raised</span>
                <span
                  className={`font-medium ${
                    t.win_rate_when_raised < 30
                      ? "text-rose-600"
                      : t.win_rate_when_raised < 50
                      ? "text-amber-600"
                      : "text-teal-600"
                  }`}
                >
                  {t.win_rate_when_raised}%
                </span>
              </div>
            </div>

            <div className="bg-stone-50 rounded-lg p-3 mt-3">
              <p className="text-[11px] text-stone-600 italic leading-relaxed">
                &ldquo;{t.sample_quote}&rdquo;
              </p>
              <p className="text-[10px] text-stone-400 mt-1">
                via {t.sample_source}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
