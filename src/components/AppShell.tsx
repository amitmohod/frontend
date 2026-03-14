"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { useDataSource } from "@/contexts/DataSourceContext";

function MobileHeader() {
  const { dataSource } = useDataSource();
  return (
    <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-stone-100 flex items-center justify-between px-4 py-3">
      <div>
        <span className="text-[15px] font-bold text-stone-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Win/Loss
        </span>
        <span className="text-[15px] font-bold text-teal-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          AI
        </span>
      </div>
      <div
        className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-full border transition-all ${
          dataSource === "hubspot"
            ? "bg-orange-50 text-orange-600 border-orange-200"
            : "bg-stone-50 text-stone-500 border-stone-200"
        }`}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            dataSource === "hubspot" ? "bg-orange-500 animate-pulse" : "bg-teal-500"
          }`}
        />
        {dataSource === "hubspot" ? "HubSpot Live" : "Mock Data"}
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="flex min-h-screen">
        {/* Sidebar: desktop only */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto min-w-0">
          {/* Mobile sticky header */}
          <MobileHeader />

          {/* Page content — extra bottom padding on mobile to clear bottom nav */}
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 sm:py-8 pb-28 lg:pb-8">
            {children}
          </div>
        </main>
      </div>

      {/* Sticky bottom nav — mobile only, renders outside the flex container so it's truly fixed */}
      <BottomNav />
    </>
  );
}
