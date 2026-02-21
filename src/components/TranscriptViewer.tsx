"use client";

import { useState } from "react";
import type { Transcript } from "@/lib/types";

interface TranscriptViewerProps {
  transcript: Transcript;
}

export default function TranscriptViewer({ transcript }: TranscriptViewerProps) {
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-stone-800">{transcript.title}</h3>
            <p className="text-xs text-stone-400 mt-1">
              {new Date(transcript.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-stone-400">Duration</div>
            <div className="text-sm font-semibold text-stone-700">
              {formatDuration(transcript.duration)}
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="mt-4">
          <div className="text-xs font-semibold text-stone-600 mb-2">Participants</div>
          <div className="flex flex-wrap gap-2">
            {transcript.meeting_attendees.map((attendee, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-50 rounded-full text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-semibold">
                  {attendee.display_name.charAt(0)}
                </div>
                <span className="text-stone-700">{attendee.display_name}</span>
                <span className="text-stone-400">{attendee.email}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="space-y-4">
        <div>
          <div className="text-xs font-semibold text-stone-600 mb-2">AI Summary</div>
          <p className="text-sm text-stone-700 leading-relaxed">{transcript.summary.overview}</p>
        </div>

        {/* Action Items */}
        {transcript.summary.action_items.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-stone-600 mb-2">Action Items</div>
            <ul className="space-y-1.5">
              {transcript.summary.action_items.map((item, idx) => (
                <li key={idx} className="text-sm text-stone-700 flex items-start gap-2">
                  <span className="text-teal-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Keywords */}
        {transcript.summary.keywords.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-stone-600 mb-2">Keywords</div>
            <div className="flex flex-wrap gap-2">
              {transcript.summary.keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Topics Discussed */}
        {transcript.summary.topics_discussed.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-stone-600 mb-2">Topics Discussed</div>
            <div className="flex flex-wrap gap-2">
              {transcript.summary.topics_discussed.map((topic, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Transcript Toggle */}
      <div className="border-t border-stone-200 pt-4">
        <button
          onClick={() => setShowFullTranscript(!showFullTranscript)}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-2"
        >
          {showFullTranscript ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Hide Full Transcript
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Show Full Transcript ({transcript.sentences.length} lines)
            </>
          )}
        </button>

        {showFullTranscript && (
          <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto bg-stone-50 rounded-lg p-4">
            {transcript.sentences.map((sentence, idx) => (
              <div key={idx} className="flex gap-3 text-sm">
                <div className="flex-shrink-0 w-14 text-xs text-stone-400 font-mono">
                  {formatTime(sentence.start_time)}
                </div>
                <div className="flex-shrink-0 w-32">
                  <span className="text-xs font-semibold text-stone-600">
                    {sentence.speaker_name}:
                  </span>
                </div>
                <div className="flex-1 text-stone-700 leading-relaxed">{sentence.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* External Link */}
      {transcript.transcript_url && (
        <div className="border-t border-stone-200 pt-4">
          <a
            href={transcript.transcript_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-500 hover:text-teal-600 transition-colors inline-flex items-center gap-1"
          >
            View in Fireflies
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
