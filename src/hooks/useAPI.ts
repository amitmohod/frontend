import useSWR from "swr";
import type {
  OverviewMetrics,
  BreakdownItem,
  CompetitorMetrics,
  ObjectionTheme,
  ICPProfile,
  Deal,
  AIInsightResponse,
  StrategicSignals,
} from "@/lib/types";

const API = "http://localhost:8000/api";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useOverview() {
  return useSWR<OverviewMetrics>(`${API}/analytics/overview`, fetcher);
}

export function useBreakdown(dimension: string) {
  return useSWR<BreakdownItem[]>(
    `${API}/analytics/breakdown/${dimension}`,
    fetcher
  );
}

export function useCompetitors() {
  return useSWR<CompetitorMetrics[]>(`${API}/analytics/competitors`, fetcher);
}

export function useObjections() {
  return useSWR<ObjectionTheme[]>(`${API}/analytics/objections`, fetcher);
}

export function useICP() {
  return useSWR<ICPProfile>(`${API}/analytics/icp`, fetcher);
}

export function useDeals(params?: {
  stage?: string;
  industry?: string;
  source?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.stage) searchParams.set("stage", params.stage);
  if (params?.industry) searchParams.set("industry", params.industry);
  if (params?.source) searchParams.set("source", params.source);
  const qs = searchParams.toString();
  return useSWR<Deal[]>(`${API}/deals${qs ? `?${qs}` : ""}`, fetcher);
}

export function useRecentDeals(limit = 10) {
  return useSWR<Deal[]>(`${API}/deals/recent?limit=${limit}`, fetcher);
}

export function useStrategicSignals() {
  return useSWR<StrategicSignals>(`${API}/analytics/signals`, fetcher);
}

export function useAIInsight(type: string, params?: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  const qs = searchParams.toString();
  return useSWR<AIInsightResponse>(
    `${API}/insights/${type}${qs ? `?${qs}` : ""}`,
    fetcher,
    { revalidateOnFocus: false }
  );
}
