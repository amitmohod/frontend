"use client";

import { useObjections, useAIInsight } from "@/hooks/useAPI";
import AIInsightBox from "@/components/AIInsightBox";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#0D9488", "#2563EB", "#D946EF", "#F59E0B", "#6366F1", "#EC4899", "#F97316", "#8B5CF6", "#06B6D4", "#10B981"];
const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #E7E5E4",
  borderRadius: "12px",
  fontSize: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

export default function ObjectionsPage() {
  const { data: objections } = useObjections();
  const { data: aiScripts, isLoading: scriptsLoading, error: scriptsError } = useAIInsight("sales-scripts");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Objection Analysis
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          Common objections, their impact on win rates, and AI-powered handling recommendations
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-700 mb-5">Objection Frequency</h3>
          {objections ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={objections} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#78716C" }} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="objection"
                  width={130}
                  tick={{ fontSize: 11, fill: "#78716C" }}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(13, 148, 136, 0.04)" }} />
                <Bar dataKey="frequency" radius={[0, 6, 6, 0]} barSize={20}>
                  {objections.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-stone-100">
            <h3 className="text-sm font-semibold text-stone-700">Win Rate Impact</h3>
            <p className="text-xs text-stone-400 mt-0.5">How each objection affects close probability</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-stone-400 uppercase tracking-wider bg-stone-50/60">
                  <th className="px-5 py-2.5 font-semibold">Objection</th>
                  <th className="px-5 py-2.5 font-semibold">Count</th>
                  <th className="px-5 py-2.5 font-semibold">Win Rate</th>
                  <th className="px-5 py-2.5 font-semibold">Industries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {objections?.map((obj) => (
                  <tr key={obj.objection} className="hover:bg-stone-50/50">
                    <td className="px-5 py-3 text-stone-700 font-medium text-xs">{obj.objection}</td>
                    <td className="px-5 py-3 text-stone-500 text-xs tabular-nums">{obj.frequency}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-14 h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              obj.win_rate_when_raised > 40
                                ? "bg-teal-500"
                                : obj.win_rate_when_raised > 25
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${obj.win_rate_when_raised}%` }}
                          />
                        </div>
                        <span className="text-xs text-stone-600 font-medium tabular-nums">
                          {obj.win_rate_when_raised}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {obj.industries.slice(0, 3).map((ind) => (
                          <span key={ind} className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-full font-medium">
                            {ind}
                          </span>
                        ))}
                        {obj.industries.length > 3 && (
                          <span className="text-[10px] text-stone-400 font-medium">
                            +{obj.industries.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AIInsightBox
        title="AI Objection Handling Guide & Sales Scripts"
        content={aiScripts?.content}
        isLoading={scriptsLoading}
        error={scriptsError}
        defaultExpanded
      />
    </div>
  );
}
