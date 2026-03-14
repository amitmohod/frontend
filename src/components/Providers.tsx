"use client";

import { DataSourceProvider } from "@/contexts/DataSourceContext";
import HubSpotTokenModal from "@/components/HubSpotTokenModal";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <DataSourceProvider>
      {children}
      <HubSpotTokenModal />
    </DataSourceProvider>
  );
}
