"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageLoadingOverlay() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [displayLoading, setDisplayLoading] = useState(false);

  useEffect(() => {
    // Start loading
    setIsLoading(true);

    // Small delay to avoid flash for instant navigations
    const showTimer = setTimeout(() => {
      if (isLoading) {
        setDisplayLoading(true);
      }
    }, 100);

    // Clear loading when pathname changes (navigation complete)
    const hideTimer = setTimeout(() => {
      setIsLoading(false);
      setDisplayLoading(false);
    }, 50);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (!displayLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 pointer-events-none animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 px-6 py-4 flex items-center gap-3">
        <svg
          className="animate-spin h-5 w-5 text-teal-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="text-sm font-medium text-stone-700">Loading...</span>
      </div>
    </div>
  );
}
