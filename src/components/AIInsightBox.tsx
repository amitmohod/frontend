"use client";

import { useState } from "react";

interface AIInsightBoxProps {
  title: string;
  content: string | undefined;
  isLoading: boolean;
  error?: Error | null;
  defaultExpanded?: boolean;
}

export default function AIInsightBox({
  title,
  content,
  isLoading,
  error,
  defaultExpanded = false,
}: AIInsightBoxProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-gradient-to-br from-indigo-950/40 to-slate-800/40 border border-indigo-500/20 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-indigo-500/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-sm font-medium text-indigo-300">{title}</span>
        </div>
        <svg
          className={`w-4 h-4 text-indigo-400 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          {isLoading && (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 bg-slate-700/50 rounded animate-pulse"
                  style={{ width: `${85 - i * 15}%` }}
                />
              ))}
            </div>
          )}
          {error && (
            <p className="text-red-400 text-sm">Failed to load AI insight.</p>
          )}
          {content && !isLoading && (
            <div
              className="prose prose-invert prose-sm max-w-none
              prose-headings:text-indigo-200 prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2
              prose-p:text-slate-300 prose-p:leading-relaxed
              prose-strong:text-white
              prose-li:text-slate-300
              prose-table:text-sm
              prose-th:text-slate-300 prose-th:font-medium prose-th:px-3 prose-th:py-1.5
              prose-td:text-slate-400 prose-td:px-3 prose-td:py-1.5
              prose-code:text-indigo-300 prose-code:bg-indigo-500/10 prose-code:px-1 prose-code:rounded"
              dangerouslySetInnerHTML={{
                __html: formatMarkdown(content),
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function formatMarkdown(text: string): string {
  return text
    .replace(/^### (.*$)/gm, '<h3 class="text-base">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-lg">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-xl">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/^- (.*$)/gm, "<li>$1</li>")
    .replace(/^(\d+)\. (.*$)/gm, "<li>$2</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul class="list-disc pl-4 space-y-1">$&</ul>')
    .replace(
      /\|(.+)\|\n\|[-| ]+\|\n((\|.+\|\n?)+)/g,
      (match, header, body) => {
        const headers = header
          .split("|")
          .filter(Boolean)
          .map((h: string) => `<th>${h.trim()}</th>`)
          .join("");
        const rows = body
          .trim()
          .split("\n")
          .map((row: string) => {
            const cells = row
              .split("|")
              .filter(Boolean)
              .map((c: string) => `<td>${c.trim()}</td>`)
              .join("");
            return `<tr>${cells}</tr>`;
          })
          .join("");
        return `<table class="w-full border-collapse"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
      }
    )
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hultop])(.+)$/gm, "<p>$1</p>")
    .replace(/<p><\/p>/g, "");
}
