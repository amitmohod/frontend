"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useDataSource } from "@/contexts/DataSourceContext";

const PRIMARY_NAV = [
  {
    label: "Overview",
    href: "/",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Win/Loss",
    href: "/win-loss",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: "ICP",
    href: "/icp",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Ask AI",
    href: "/ask",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
];

const SECONDARY_NAV = [
  {
    label: "Competitors",
    href: "/competitors",
    desc: "Head-to-head analysis & battle cards",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Objections",
    href: "/objections",
    desc: "Common objections & AI handling scripts",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    label: "Transcripts",
    href: "/transcripts",
    desc: "Recorded sales call conversations",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const { dataSource, isSwitching, switchToMock, openHubSpotModal } = useDataSource();

  const isMoreActive = SECONDARY_NAV.some((item) => pathname === item.href);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Backdrop */}
      {moreOpen && (
        <div
          className="fixed inset-0 bg-black/25 z-40 lg:hidden"
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* More bottom sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 lg:hidden transition-transform duration-300 ease-out ${
          moreOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white rounded-t-2xl shadow-2xl border-t border-stone-100 pb-20">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-9 h-1 bg-stone-200 rounded-full" />
          </div>

          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-6 pb-2">
            More Features
          </p>

          {/* Secondary nav items */}
          <div className="px-3">
            {SECONDARY_NAV.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all mb-0.5 ${
                    isActive ? "bg-teal-50" : "active:bg-stone-50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? "bg-teal-100 text-teal-600" : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-[14px] font-semibold ${
                        isActive ? "text-teal-700" : "text-stone-800"
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="text-xs text-stone-400 truncate">{item.desc}</div>
                  </div>
                  <svg
                    className="w-4 h-4 text-stone-300 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>

          {/* Data source toggle */}
          <div className="mx-3 mt-3 border-t border-stone-100 pt-3">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-3 mb-2">
              Data Source
            </p>
            {dataSource === "mock" ? (
              <button
                onClick={() => { openHubSpotModal(); setMoreOpen(false); }}
                disabled={isSwitching}
                className="w-full flex items-center justify-between px-3 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-600 active:bg-stone-100 transition-all text-sm font-medium disabled:opacity-50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  Mock Data
                </div>
                <span className="text-xs text-teal-600 font-semibold">Connect HubSpot →</span>
              </button>
            ) : (
              <button
                onClick={() => { switchToMock(); setMoreOpen(false); }}
                disabled={isSwitching}
                className="w-full flex items-center justify-between px-3 py-3 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 active:bg-orange-100 transition-all text-sm font-medium disabled:opacity-50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  HubSpot Live
                </div>
                <span className="text-xs text-orange-500 font-semibold">Disconnect</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-stone-200 shadow-[0_-4px_24px_rgba(0,0,0,0.07)]">
        <div className="flex items-center justify-around px-1 py-1">
          {PRIMARY_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 py-2 px-3 min-w-0 flex-1"
              >
                <div
                  className={`flex items-center justify-center w-9 h-7 rounded-lg transition-all ${
                    isActive ? "bg-teal-50 text-teal-600" : "text-stone-400"
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-[10px] font-semibold transition-colors ${
                    isActive ? "text-teal-600" : "text-stone-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className="flex flex-col items-center gap-0.5 py-2 px-3 flex-1"
          >
            <div
              className={`relative flex items-center justify-center w-9 h-7 rounded-lg transition-all ${
                isMoreActive || moreOpen ? "bg-teal-50 text-teal-600" : "text-stone-400"
              }`}
            >
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01" />
              </svg>
              {isMoreActive && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-teal-500 rounded-full" />
              )}
            </div>
            <span
              className={`text-[10px] font-semibold transition-colors ${
                isMoreActive || moreOpen ? "text-teal-600" : "text-stone-400"
              }`}
            >
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
