"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type DataSource = "mock" | "hubspot";

export interface PreviewDeal {
  id: string;
  name: string;
  stage: string;
  amount: number;
  close_date: string;
  create_date: string;
  pipeline: string;
  product_line: string;
  deal_source: string;
  loss_reason: string | null;
  win_reason: string | null;
  competitor: string | null;
  sales_rep: string;
  company_id: string;
  company_name: string;
  contact_id: string;
  cycle_days: number;
  objections: string[];
  conversation_signals: unknown[];
}

interface DataSourceContextValue {
  dataSource: DataSource;
  hasToken: boolean;
  isSwitching: boolean;
  showTokenModal: boolean;
  previewDeals: PreviewDeal[];
  isFetchingPreview: boolean;
  previewError: string;
  switchToMock: () => Promise<void>;
  openHubSpotModal: () => void;
  closeHubSpotModal: () => void;
  fetchPreview: (token: string) => Promise<PreviewDeal[] | null>;
  activateHubSpot: (token: string, selectedDeals: PreviewDeal[]) => Promise<void>;
  clearPreview: () => void;
  clearSavedToken: () => void;
}

const DataSourceContext = createContext<DataSourceContextValue>({
  dataSource: "mock",
  hasToken: false,
  isSwitching: false,
  showTokenModal: false,
  previewDeals: [],
  isFetchingPreview: false,
  previewError: "",
  switchToMock: async () => {},
  openHubSpotModal: () => {},
  closeHubSpotModal: () => {},
  fetchPreview: async (_token: string) => null,
  activateHubSpot: async (_token: string, _deals: PreviewDeal[]) => {},
  clearPreview: () => {},
  clearSavedToken: () => {},
});

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export function DataSourceProvider({ children }: { children: ReactNode }) {
  const [dataSource, setDataSource] = useState<DataSource>("mock");
  const [hasToken, setHasToken] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [previewDeals, setPreviewDeals] = useState<PreviewDeal[]>([]);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);
  const [previewError, setPreviewError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/config`)
      .then((r) => r.json())
      .then((data) => {
        setDataSource(data.data_source as DataSource);
        setHasToken(data.has_token);
      })
      .catch(() => {});
  }, []);

  const switchToMock = useCallback(async () => {
    if (isSwitching) return;
    setIsSwitching(true);
    try {
      await fetch(`${API_BASE}/config/data-source`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "mock" }),
      });
      setDataSource("mock");
      setHasToken(false);
      // Keep token saved for re-activation; don't clear localStorage
      window.location.reload();
    } catch {
      alert("Failed to connect to backend");
    } finally {
      setIsSwitching(false);
    }
  }, [isSwitching]);

  const openHubSpotModal = useCallback(() => {
    setPreviewDeals([]);
    setPreviewError("");
    setShowTokenModal(true);
  }, []);

  const closeHubSpotModal = useCallback(() => {
    setShowTokenModal(false);
    setPreviewDeals([]);
    setPreviewError("");
  }, []);

  const clearPreview = useCallback(() => {
    setPreviewDeals([]);
    setPreviewError("");
  }, []);

  const clearSavedToken = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hubspot_token");
    }
  }, []);

  const fetchPreview = useCallback(async (token: string): Promise<PreviewDeal[] | null> => {
    setIsFetchingPreview(true);
    setPreviewError("");
    try {
      const res = await fetch(`${API_BASE}/config/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to fetch preview");
      }
      const data = await res.json();
      const deals = data.deals as PreviewDeal[];
      setPreviewDeals(deals);
      return deals;
    } catch (e: unknown) {
      setPreviewError(e instanceof Error ? e.message : "Failed to fetch from HubSpot");
      return null;
    } finally {
      setIsFetchingPreview(false);
    }
  }, []);

  const activateHubSpot = useCallback(async (token: string, selectedDeals: PreviewDeal[]) => {
    if (isSwitching) return;
    setIsSwitching(true);
    try {
      const res = await fetch(`${API_BASE}/config/data-source`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "hubspot", token, override_deals: selectedDeals }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to activate");
      }
      setDataSource("hubspot");
      setHasToken(true);
      setShowTokenModal(false);
      setPreviewDeals([]);
      window.location.reload();
    } catch (e: unknown) {
      throw e;
    } finally {
      setIsSwitching(false);
    }
  }, [isSwitching]);

  return (
    <DataSourceContext.Provider
      value={{
        dataSource, hasToken, isSwitching, showTokenModal,
        previewDeals, isFetchingPreview, previewError,
        switchToMock, openHubSpotModal, closeHubSpotModal,
        fetchPreview, activateHubSpot, clearPreview, clearSavedToken,
      }}
    >
      {children}
    </DataSourceContext.Provider>
  );
}

export const useDataSource = () => useContext(DataSourceContext);
