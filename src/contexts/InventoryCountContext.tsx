"use client";
import { InventoryCount } from "@/types/product";
import { createContext, ReactNode, useContext, useState } from "react";

interface InventoryCountContextType {
  inventoryCounts: InventoryCount[];
  addInventoryCount: (newCount: InventoryCount) => void;
  updateInventoryCount: (id: string, updatedCount: InventoryCount) => void;
  deleteInventoryCount: (id: string) => void;
}

export const InventoryCountContext = createContext<
  InventoryCountContextType | undefined
>(undefined);

interface InventoryCountProviderProps {
  children: ReactNode;
}

export const InventoryCountProvider = ({
  children,
}: InventoryCountProviderProps) => {
  const [inventoryCounts, setInventoryCounts] = useState<InventoryCount[]>([]);

  const addInventoryCount = (newCount: InventoryCount) => {
    setInventoryCounts((prev) => [...prev, newCount]);
  };

  const updateInventoryCount = (id: string, updatedCount: InventoryCount) => {
    setInventoryCounts((prev) =>
      prev.map((count) => (count.id === id ? updatedCount : count))
    );
  };

  const deleteInventoryCount = (id: string) => {
    setInventoryCounts((prev) => prev.filter((count) => count.id !== id));
  };

  return (
    <InventoryCountContext.Provider
      value={{
        inventoryCounts,
        addInventoryCount,
        updateInventoryCount,
        deleteInventoryCount,
      }}
    >
      {children}
    </InventoryCountContext.Provider>
  );
};

export const useInventoryCount = () => {
  const context = useContext(InventoryCountContext);
  if (!context) {
    throw new Error(
      "useInventoryCount must be used within an InventoryCountProvider"
    );
  }
  return context;
};
