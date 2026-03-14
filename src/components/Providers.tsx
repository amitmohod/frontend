"use client";

import { DataSourceProvider } from "@/contexts/DataSourceContext";
import { ProductLineProvider } from "@/contexts/ProductLineContext";
import HubSpotTokenModal from "@/components/HubSpotTokenModal";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <DataSourceProvider>
      <ProductLineProvider>
        {children}
        <HubSpotTokenModal />
      </ProductLineProvider>
    </DataSourceProvider>
  );
}
