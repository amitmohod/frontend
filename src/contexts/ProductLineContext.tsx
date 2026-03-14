"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type ProductLine = "all" | "TA" | "SI" | "full_platform";

export const PRODUCT_LINE_LABELS: Record<ProductLine, string> = {
  all: "All",
  TA: "TA",
  SI: "SI",
  full_platform: "Full Platform",
};

interface ProductLineContextValue {
  productLine: ProductLine;
  setProductLine: (pl: ProductLine) => void;
}

const ProductLineContext = createContext<ProductLineContextValue>({
  productLine: "all",
  setProductLine: () => {},
});

export function ProductLineProvider({ children }: { children: ReactNode }) {
  const [productLine, setProductLine] = useState<ProductLine>("all");
  return (
    <ProductLineContext.Provider value={{ productLine, setProductLine }}>
      {children}
    </ProductLineContext.Provider>
  );
}

export function useProductLine() {
  return useContext(ProductLineContext);
}
