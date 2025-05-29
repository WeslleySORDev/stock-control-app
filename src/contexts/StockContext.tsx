"use client";
import { Stock } from "@/types/inventory";
import { createContext, ReactNode, useContext, useState } from "react";

interface StockContextType {
  stocks: Stock[];
  addStock: (newCount: Stock) => void;
  updateStock: (id: string, updatedCount: Stock) => void;
  deleteStock: (id: string) => void;
}

export const StockContext = createContext<StockContextType | undefined>(
  undefined
);

interface StockProviderProps {
  children: ReactNode;
}

export const StockProvider = ({ children }: StockProviderProps) => {
  const [stocks, setStocks] = useState<Stock[]>([]);

  const addStock = (newCount: Stock) => {
    setStocks((prev) => [...prev, newCount]);
  };

  const updateStock = (id: string, updatedCount: Stock) => {
    setStocks((prev) =>
      prev.map((count) => (count.id === id ? updatedCount : count))
    );
  };

  const deleteStock = (id: string) => {
    setStocks((prev) => prev.filter((count) => count.id !== id));
  };

  return (
    <StockContext.Provider
      value={{
        stocks,
        addStock,
        updateStock,
        deleteStock,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error("useStock must be used within an StockProvider");
  }
  return context;
};
