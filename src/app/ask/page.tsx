"use client";

import { useState, useRef, useEffect } from "react";
import type { AskAIMessage } from "@/lib/types";
import { askAI } from "@/lib/api";

const SUGGESTED_QUESTIONS = [
  "What's our biggest weakness against ZetaFlow?",
  "Which industries should we stop pursuing?",
  "What's our ideal deal size and why?",
  "How can we improve our outbound win rate?",
  "What objections do we handle worst?",
  "Which buyer persona converts best?",
];

export default function AskAIPage() {
  const [messages, setMessages] = useState<AskAIMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (question?: string) => {
    const q = question || input.trim();
    if (!q || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setIsLoading(true);

    try {
      const res = await askAI(q);
      setMessages((prev) => [...prev, { role: "assistant", content: res.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process that question. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Ask AI
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          Ask any question about your deal data and get AI-powered insights
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-5 ring-1 ring-teal-100">
              <svg className="w-7 h-7 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-stone-500 text-sm mb-1 font-medium">What would you like to know?</p>
            <p className="text-stone-400 text-xs mb-8">Ask me anything about your 175 CRM deals</p>
            <div className="grid grid-cols-2 gap-2.5 max-w-lg">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-left text-xs px-4 py-3 rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-stone-800 hover:border-teal-200 hover:bg-teal-50/30 transition-all shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-5 py-3.5 ${
                msg.role === "user"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white border border-stone-200 text-stone-700 shadow-sm"
              }`}
            >
              {msg.role === "assistant" ? (
                <div
                  className="prose prose-sm max-w-none prose-p:text-stone-600 prose-strong:text-stone-800 prose-li:text-stone-600 prose-headings:text-stone-800"
                  dangerouslySetInnerHTML={{
                    __html: formatSimpleMarkdown(msg.content),
                  }}
                />
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 rounded-2xl px-5 py-4 shadow-sm">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-stone-200 pt-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your deal data..."
            className="flex-1 bg-white border border-stone-200 rounded-xl px-5 py-3.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-300 transition-all shadow-sm"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white transition-colors shadow-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function formatSimpleMarkdown(text: string): string {
  return text
    .replace(/^### (.*$)/gm, '<h3 class="text-base font-bold text-stone-800 mt-3 mb-1">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold text-stone-800 mt-3 mb-1">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="bg-teal-50 px-1.5 py-0.5 rounded-md text-teal-700 text-xs font-medium">$1</code>')
    .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4">$2</li>')
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}
