const API_BASE = "http://localhost:8000/api";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Analytics
export const getOverview = () => fetchAPI<import("./types").OverviewMetrics>("/analytics/overview");
export const getBreakdown = (dimension: string) =>
  fetchAPI<import("./types").BreakdownItem[]>(`/analytics/breakdown/${dimension}`);
export const getCompetitors = () => fetchAPI<import("./types").CompetitorMetrics[]>("/analytics/competitors");
export const getObjections = () => fetchAPI<import("./types").ObjectionTheme[]>("/analytics/objections");
export const getICP = () => fetchAPI<import("./types").ICPProfile>("/analytics/icp");

// Deals
export const getDeals = (params?: { stage?: string; industry?: string; source?: string }) => {
  const searchParams = new URLSearchParams();
  if (params?.stage) searchParams.set("stage", params.stage);
  if (params?.industry) searchParams.set("industry", params.industry);
  if (params?.source) searchParams.set("source", params.source);
  const qs = searchParams.toString();
  return fetchAPI<import("./types").Deal[]>(`/deals${qs ? `?${qs}` : ""}`);
};

export const getRecentDeals = (limit = 10) =>
  fetchAPI<import("./types").Deal[]>(`/deals/recent?limit=${limit}`);

// AI Insights
export const getAIInsight = (type: string, params?: Record<string, string>) => {
  const searchParams = new URLSearchParams(params);
  const qs = searchParams.toString();
  return fetchAPI<import("./types").AIInsightResponse>(`/insights/${type}${qs ? `?${qs}` : ""}`);
};

export const askAI = (question: string) =>
  fetchAPI<{ answer: string; question: string }>("/insights/ask", {
    method: "POST",
    body: JSON.stringify({ question }),
  });

// SWR fetcher
export const fetcher = (url: string) => fetchAPI(url);
