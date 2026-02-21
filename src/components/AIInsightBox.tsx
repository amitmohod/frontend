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
    <div className="bg-gradient-to-br from-teal-50/80 to-white border border-teal-200/60 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-teal-50/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-teal-800">{title}</span>
        </div>
        <svg
          className={`w-4 h-4 text-teal-400 transition-transform duration-200 ${
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
        <div className="px-5 pb-5">
          {isLoading && (
            <div className="space-y-2.5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 bg-teal-100/60 rounded-full animate-pulse"
                  style={{ width: `${90 - i * 15}%` }}
                />
              ))}
            </div>
          )}
          {error && (
            <p className="text-rose-500 text-sm">Failed to load AI insight.</p>
          )}
          {content && !isLoading && (
            <div
              className="prose prose-sm max-w-none
              prose-headings:text-stone-800 prose-headings:font-bold prose-headings:mt-5 prose-headings:mb-2
              prose-p:text-stone-600 prose-p:leading-relaxed
              prose-strong:text-stone-800
              prose-li:text-stone-600
              prose-table:text-sm
              prose-th:text-stone-600 prose-th:font-semibold prose-th:px-3 prose-th:py-2 prose-th:bg-stone-50
              prose-td:text-stone-500 prose-td:px-3 prose-td:py-2 prose-td:border-t prose-td:border-stone-100
              prose-code:text-teal-700 prose-code:bg-teal-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-code:font-medium"
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
        return `<table class="w-full border-collapse rounded-lg overflow-hidden"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
      }
    )
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hultop])(.+)$/gm, "<p>$1</p>")
    .replace(/<p><\/p>/g, "");
}
