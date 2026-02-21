import useSWR from "swr";
import type {
  OverviewMetrics,
  BreakdownItem,
  CompetitorMetrics,
  ObjectionTheme,
  ICPProfile,
  Deal,
  AIInsightResponse,
  DealTranscriptsResponse,
  Transcript,
  TranscriptListItem,
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

export function useAIInsight(type: string, params?: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  const qs = searchParams.toString();
  return useSWR<AIInsightResponse>(
    `${API}/insights/${type}${qs ? `?${qs}` : ""}`,
    fetcher,
    { revalidateOnFocus: false }
  );
}

export function useDealTranscripts(dealId: string | null) {
  return useSWR<DealTranscriptsResponse>(
    dealId ? `${API}/transcripts/deal/${dealId}` : null,
    fetcher
  );
}

export function useTranscript(transcriptId: string | null) {
  return useSWR<Transcript>(
    transcriptId ? `${API}/transcripts/${transcriptId}` : null,
    fetcher
  );
}

export function useTranscripts(params?: { participant_email?: string; contact_id?: string; limit?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.participant_email) searchParams.set("participant_email", params.participant_email);
  if (params?.contact_id) searchParams.set("contact_id", params.contact_id);
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  const qs = searchParams.toString();
  return useSWR<{ total: number; count: number; transcripts: TranscriptListItem[] }>(
    `${API}/transcripts${qs ? `?${qs}` : ""}`,
    fetcher
  );
}
