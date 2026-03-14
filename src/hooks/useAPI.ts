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
  TrendPoint,
  DealTranscriptsResponse,
  Transcript,
  TranscriptListItem,
  FeatureGap,
  IntegrationGap,
  PersonaNeed,
} from "@/lib/types";
import type { ProductLine } from "@/contexts/ProductLineContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function buildUrl(base: string, params: Record<string, string | undefined>): string {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "" && v !== "all")
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return qs ? `${base}?${qs}` : base;
}

export function useOverview(productLine?: ProductLine) {
  return useSWR<OverviewMetrics>(
    buildUrl(`${API}/analytics/overview`, { product_line: productLine }),
    fetcher
  );
}

export function useBreakdown(dimension: string, options?: { productLine?: ProductLine }) {
  const qs = buildUrl(`${API}/analytics/breakdown/${dimension}`, { product_line: options?.productLine });
  return useSWR<BreakdownItem[]>(qs, fetcher);
}

export function useCompetitors(productLine?: ProductLine) {
  return useSWR<CompetitorMetrics[]>(
    buildUrl(`${API}/analytics/competitors`, { product_line: productLine }),
    fetcher
  );
}

export function useObjections(productLine?: ProductLine) {
  return useSWR<ObjectionTheme[]>(
    buildUrl(`${API}/analytics/objections`, { product_line: productLine }),
    fetcher
  );
}

export function useICP(productLine?: ProductLine) {
  return useSWR<ICPProfile>(
    buildUrl(`${API}/analytics/icp`, { product_line: productLine }),
    fetcher
  );
}

export function useDeals(params?: {
  stage?: string;
  industry?: string;
  source?: string;
  productLine?: ProductLine;
}) {
  const searchParams = new URLSearchParams();
  if (params?.stage) searchParams.set("stage", params.stage);
  if (params?.industry) searchParams.set("industry", params.industry);
  if (params?.source) searchParams.set("source", params.source);
  if (params?.productLine && params.productLine !== "all") searchParams.set("product_line", params.productLine);
  const qs = searchParams.toString();
  return useSWR<Deal[]>(`${API}/deals${qs ? `?${qs}` : ""}`, fetcher);
}

export function useRecentDeals(limit = 10, productLine?: ProductLine) {
  return useSWR<Deal[]>(
    buildUrl(`${API}/deals/recent`, { limit: String(limit), product_line: productLine }),
    fetcher
  );
}

export function useTrends(productLine?: ProductLine) {
  return useSWR<TrendPoint[]>(
    buildUrl(`${API}/analytics/trends`, { product_line: productLine }),
    fetcher
  );
}

export function useStrategicSignals(productLine?: ProductLine) {
  return useSWR<StrategicSignals>(
    buildUrl(`${API}/analytics/signals`, { product_line: productLine }),
    fetcher
  );
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

export function useFeatureGaps(productLine?: ProductLine) {
  return useSWR<FeatureGap[]>(
    buildUrl(`${API}/product/feature-gaps`, { product_line: productLine }),
    fetcher
  );
}

export function useIntegrationGaps(productLine?: ProductLine) {
  return useSWR<IntegrationGap[]>(
    buildUrl(`${API}/product/integration-gaps`, { product_line: productLine }),
    fetcher
  );
}

export function usePersonaNeeds(productLine?: ProductLine) {
  return useSWR<PersonaNeed[]>(
    buildUrl(`${API}/product/persona-needs`, { product_line: productLine }),
    fetcher
  );
}
