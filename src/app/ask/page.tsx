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
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">Ask AI</h1>
        <p className="text-sm text-slate-400 mt-1">
          Ask any question about your deal data and get AI-powered insights
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              Ask me anything about your 175 CRM deals
            </p>
            <div className="grid grid-cols-2 gap-2 max-w-lg">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-left text-xs px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-indigo-500/30 transition-colors"
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
              className={`max-w-[75%] rounded-xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-indigo-500/20 text-indigo-100"
                  : "bg-slate-800/50 border border-slate-700/50 text-slate-300"
              }`}
            >
              {msg.role === "assistant" ? (
                <div
                  className="prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-strong:text-white prose-li:text-slate-300"
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
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-700/50 pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your deal data..."
            className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-medium text-white transition-colors"
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
    .replace(/^### (.*$)/gm, '<h3 class="text-base font-semibold text-indigo-200 mt-3 mb-1">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold text-indigo-200 mt-3 mb-1">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="bg-slate-700/50 px-1 rounded text-indigo-300">$1</code>')
    .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4">$2</li>')
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}
