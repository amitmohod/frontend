"use client";

import { useState, useRef, useEffect } from "react";
import { useDataSource, PreviewDeal } from "@/contexts/DataSourceContext";

type Step = "token" | "preview";

function EditableCell({
  value,
  onSave,
  type = "text",
  className = "",
}: {
  value: string | number | null;
  onSave: (val: string) => void;
  type?: "text" | "number";
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ""));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    onSave(draft);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
        className={`w-full px-1.5 py-0.5 border border-teal-400 rounded text-[12px] outline-none bg-white ${className}`}
      />
    );
  }

  return (
    <span
      onClick={() => { setDraft(String(value ?? "")); setEditing(true); }}
      title="Click to edit"
      className={`cursor-pointer hover:bg-teal-50 px-1 py-0.5 rounded group-hover:underline decoration-dashed decoration-stone-300 ${className}`}
    >
      {value !== null && value !== "" ? String(value) : <span className="text-stone-300 italic">—</span>}
    </span>
  );
}

export default function HubSpotTokenModal() {
  const {
    showTokenModal, closeHubSpotModal,
    isFetchingPreview, previewError,
    fetchPreview, activateHubSpot, isSwitching, clearSavedToken,
  } = useDataSource();

  const [step, setStep] = useState<Step>("token");
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [activateError, setActivateError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Local mutable copy of deals for editing + selection
  const [deals, setDeals] = useState<PreviewDeal[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (showTokenModal) {
      setStep("token");
      // Load saved token from localStorage
      const savedToken = typeof window !== "undefined" ? localStorage.getItem("hubspot_token") : null;
      setToken(savedToken || "");
      setTokenError("");
      setActivateError("");
      setDeals([]);
      setSelected(new Set());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showTokenModal]);

  if (!showTokenModal) return null;

  const handleFetchPreview = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = token.trim();
    if (!t) { setTokenError("Please enter your access token"); return; }
    setTokenError("");
    const result = await fetchPreview(t);
    if (result !== null) {
      setDeals(result);
      setSelected(new Set(result.map((d) => d.id)));
      setStep("preview");
    }
  };

  const updateDeal = (id: string, field: keyof PreviewDeal, value: string) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        if (field === "amount") return { ...d, amount: parseFloat(value) || 0 };
        return { ...d, [field]: value };
      })
    );
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === deals.length) setSelected(new Set());
    else setSelected(new Set(deals.map((d) => d.id)));
  };

  const handleActivate = async () => {
    setActivateError("");
    const chosenDeals = deals.filter((d) => selected.has(d.id));
    if (chosenDeals.length === 0) { setActivateError("Select at least one deal"); return; }
    try {
      await activateHubSpot(token.trim(), chosenDeals);
      // Save token to localStorage after successful activation
      if (typeof window !== "undefined") {
        localStorage.setItem("hubspot_token", token.trim());
      }
    } catch (e: unknown) {
      setActivateError(e instanceof Error ? e.message : "Failed to activate");
    }
  };

  const handleClearToken = () => {
    clearSavedToken();
    setToken("");
    setTokenError("");
  };

  const selectedCount = selected.size;
  const allSelected = selectedCount === deals.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeHubSpotModal} />

      <div
        className={`relative bg-white rounded-2xl shadow-2xl mx-4 flex flex-col transition-all duration-300 ${
          step === "preview" ? "w-full max-w-4xl max-h-[90vh]" : "w-full max-w-md"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-stone-100 shrink-0">
          <div>
            <h2 className="text-[15px] font-semibold text-stone-900">
              {step === "token" ? "Connect HubSpot" : "Preview HubSpot Data"}
            </h2>
            <p className="text-[12px] text-stone-500 mt-0.5">
              {step === "token"
                ? "Enter your Private App access token. It will be saved for future sessions."
                : `${deals.length} closed deals fetched — select and edit before activating.`}
            </p>
          </div>
          <button onClick={closeHubSpotModal} className="text-stone-400 hover:text-stone-600 transition ml-4 mt-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step 1: Token entry */}
        {step === "token" && (
          <div className="px-6 py-5">
            <div className="bg-orange-50 border border-orange-100 rounded-lg px-3 py-2.5 mb-4 text-[11px] text-orange-700 space-y-1">
              <p className="font-medium">How to get your token:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-orange-600">
                <li>HubSpot → Development → Legacy Apps</li>
                <li>Create a new app with CRM read scopes</li>
                <li>Copy the access token from the Auth tab</li>
              </ol>
            </div>

            <form onSubmit={handleFetchPreview} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1.5">Access Token</label>
                <input
                  ref={inputRef}
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 text-[13px] font-mono text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition"
                />
                {(tokenError || previewError) && (
                  <p className="text-[11px] text-red-500 mt-1.5">{tokenError || previewError}</p>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeHubSpotModal}
                  className="flex-1 px-4 py-2 rounded-lg border border-stone-200 text-[13px] text-stone-600 hover:bg-stone-50 transition"
                >
                  Cancel
                </button>
                {token && (
                  <button
                    type="button"
                    onClick={handleClearToken}
                    className="px-4 py-2 rounded-lg border border-red-200 text-[13px] text-red-600 hover:bg-red-50 transition"
                    title="Clear saved token and use a new one"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isFetchingPreview || !token.trim()}
                  className="flex-1 px-4 py-2 rounded-lg bg-orange-500 text-white text-[13px] font-medium hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isFetchingPreview ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Fetching…
                    </>
                  ) : (
                    "Fetch Preview →"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Preview table */}
        {step === "preview" && (
          <>
            <div className="overflow-auto flex-1 px-1">
              <table className="w-full text-[12px]">
                <thead className="sticky top-0 bg-stone-50 z-10">
                  <tr className="border-b border-stone-200">
                    <th className="px-3 py-2.5 text-left w-8">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        className="accent-teal-600"
                      />
                    </th>
                    <th className="px-3 py-2.5 text-left font-medium text-stone-500">Deal Name</th>
                    <th className="px-3 py-2.5 text-left font-medium text-stone-500">Company</th>
                    <th className="px-3 py-2.5 text-left font-medium text-stone-500">Stage</th>
                    <th className="px-3 py-2.5 text-left font-medium text-stone-500">Amount ($)</th>
                    <th className="px-3 py-2.5 text-left font-medium text-stone-500">Competitor</th>
                    <th className="px-3 py-2.5 text-left font-medium text-stone-500">Source</th>
                    <th className="px-3 py-2.5 text-left font-medium text-stone-500">Close Date</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-[13px] text-stone-400">
                        No deals found in this HubSpot account yet.
                      </td>
                    </tr>
                  )}
                  {deals.map((deal, i) => {
                    const isSelected = selected.has(deal.id);
                    return (
                      <tr
                        key={deal.id}
                        className={`border-b border-stone-100 group transition-colors ${
                          isSelected ? "bg-white" : "bg-stone-50 opacity-50"
                        } ${i % 2 === 0 ? "" : "bg-stone-50/50"}`}
                      >
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(deal.id)}
                            className="accent-teal-600"
                          />
                        </td>
                        <td className="px-3 py-2 max-w-[200px]">
                          <EditableCell
                            value={deal.name}
                            onSave={(v) => updateDeal(deal.id, "name", v)}
                            className="text-stone-800 font-medium"
                          />
                        </td>
                        <td className="px-3 py-2 text-stone-500 max-w-[140px] truncate">
                          {deal.company_name || <span className="text-stone-300 italic">—</span>}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              deal.stage === "closedwon"
                                ? "bg-teal-50 text-teal-700"
                                : deal.stage === "closedlost"
                                ? "bg-red-50 text-red-600"
                                : "bg-stone-100 text-stone-500"
                            }`}
                          >
                            {deal.stage === "closedwon" ? "Won" : deal.stage === "closedlost" ? "Lost" : deal.stage}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <EditableCell
                            value={deal.amount === 0 ? "" : deal.amount}
                            type="number"
                            onSave={(v) => updateDeal(deal.id, "amount", v)}
                            className="text-stone-700"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <EditableCell
                            value={deal.competitor}
                            onSave={(v) => updateDeal(deal.id, "competitor", v)}
                            className="text-stone-600"
                          />
                        </td>
                        <td className="px-3 py-2 text-stone-500">
                          <EditableCell
                            value={deal.deal_source}
                            onSave={(v) => updateDeal(deal.id, "deal_source", v)}
                            className="text-stone-600"
                          />
                        </td>
                        <td className="px-3 py-2 text-stone-400 whitespace-nowrap">
                          {deal.close_date ? new Date(deal.close_date).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between shrink-0 bg-white rounded-b-2xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep("token")}
                  className="text-[12px] text-stone-500 hover:text-stone-700 transition"
                >
                  ← Back
                </button>
                <span className="text-[12px] text-stone-400">
                  {selectedCount} of {deals.length} deals selected
                </span>
                {activateError && <span className="text-[12px] text-red-500">{activateError}</span>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={closeHubSpotModal}
                  className="px-4 py-2 rounded-lg border border-stone-200 text-[13px] text-stone-600 hover:bg-stone-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleActivate}
                  disabled={isSwitching || selectedCount === 0}
                  className="px-5 py-2 rounded-lg bg-orange-500 text-white text-[13px] font-medium hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSwitching ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Activating…
                    </>
                  ) : (
                    `Activate with ${selectedCount} deal${selectedCount !== 1 ? "s" : ""}`
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
