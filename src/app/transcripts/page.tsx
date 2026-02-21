"use client";

import { useState } from "react";
import { useRecentDeals, useDealTranscripts } from "@/hooks/useAPI";
import TranscriptViewer from "@/components/TranscriptViewer";

export default function TranscriptsPage() {
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const { data: deals, isLoading: dealsLoading } = useRecentDeals(50);
  const { data: transcriptsData, isLoading: transcriptsLoading } = useDealTranscripts(selectedDealId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Call Transcripts
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          View recorded sales call conversations linked to deals
        </p>
      </div>

      {/* Deal Selector */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
        <label className="block text-sm font-semibold text-stone-700 mb-3">
          Select a Deal
        </label>
        {dealsLoading ? (
          <div className="h-10 bg-stone-100 rounded-lg animate-pulse" />
        ) : (
          <select
            value={selectedDealId || ""}
            onChange={(e) => setSelectedDealId(e.target.value || null)}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          >
            <option value="">-- Choose a deal --</option>
            {deals?.map((deal) => (
              <option key={deal.id} value={deal.id}>
                {deal.name} ({deal.stage === "closedwon" ? "Won" : "Lost"}) - $
                {deal.amount.toLocaleString()}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Transcripts Display */}
      {selectedDealId && (
        <div>
          {transcriptsLoading ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <div className="h-6 bg-stone-100 rounded w-1/3 mb-4 animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 bg-stone-100 rounded animate-pulse" />
                <div className="h-4 bg-stone-100 rounded animate-pulse" />
                <div className="h-4 bg-stone-100 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ) : transcriptsData && transcriptsData.transcript_count > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-stone-800">
                  {transcriptsData.deal_name}
                </h2>
                <span className="text-xs text-stone-400">
                  {transcriptsData.transcript_count} transcript
                  {transcriptsData.transcript_count !== 1 ? "s" : ""}
                </span>
              </div>

              {transcriptsData.transcripts.map((transcript) => (
                <TranscriptViewer key={transcript.id} transcript={transcript} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center shadow-sm">
              <div className="text-stone-400 text-sm">
                <svg
                  className="mx-auto h-12 w-12 mb-4 text-stone-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
                No transcripts found for this deal
              </div>
            </div>
          )}
        </div>
      )}

      {!selectedDealId && (
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-12 text-center">
          <div className="text-stone-400 text-sm">
            Select a deal above to view its call transcripts
          </div>
        </div>
      )}
    </div>
  );
}
