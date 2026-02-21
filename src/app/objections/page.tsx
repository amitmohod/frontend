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

const COLORS = ["#818cf8", "#34d399", "#f472b6", "#fbbf24", "#60a5fa", "#a78bfa", "#fb923c", "#e879f9", "#22d3ee", "#4ade80"];

export default function ObjectionsPage() {
  const { data: objections } = useObjections();
  const { data: aiScripts, isLoading: scriptsLoading, error: scriptsError } = useAIInsight("sales-scripts");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Objection Analysis</h1>
        <p className="text-sm text-slate-400 mt-1">
          Common objections, their impact on win rates, and AI-powered handling recommendations
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Frequency Chart */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-medium text-slate-300 mb-4">
            Objection Frequency
          </h3>
          {objections ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={objections} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                />
                <YAxis
                  type="category"
                  dataKey="objection"
                  width={130}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="frequency" radius={[0, 4, 4, 0]} barSize={20}>
                  {objections.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </div>

        {/* Objection Impact Table */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700/50">
            <h3 className="text-sm font-medium text-slate-300">
              Win Rate Impact
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              How each objection affects close probability
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-2.5 font-medium">Objection</th>
                  <th className="px-4 py-2.5 font-medium">Count</th>
                  <th className="px-4 py-2.5 font-medium">Win Rate</th>
                  <th className="px-4 py-2.5 font-medium">Industries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {objections?.map((obj) => (
                  <tr key={obj.objection} className="hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 text-slate-300 font-medium text-xs">
                      {obj.objection}
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 text-xs">
                      {obj.frequency}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              obj.win_rate_when_raised > 40
                                ? "bg-emerald-400"
                                : obj.win_rate_when_raised > 25
                                ? "bg-yellow-400"
                                : "bg-red-400"
                            }`}
                            style={{ width: `${obj.win_rate_when_raised}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-300">
                          {obj.win_rate_when_raised}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {obj.industries.slice(0, 3).map((ind) => (
                          <span
                            key={ind}
                            className="text-[10px] bg-slate-700/50 text-slate-400 px-1 py-0.5 rounded"
                          >
                            {ind}
                          </span>
                        ))}
                        {obj.industries.length > 3 && (
                          <span className="text-[10px] text-slate-500">
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

      {/* AI Sales Scripts */}
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
