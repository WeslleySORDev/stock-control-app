"use client";
import { db } from "@/config/firebase";
import { InventoryCount } from "@/types/inventory";
import { collection, deleteDoc, doc, onSnapshot, setDoc, Timestamp } from "firebase/firestore";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface InventoryCountContextType {
  inventoryCountList: InventoryCount[];
  addInventoryCountToList: (newCount: Omit<InventoryCount, "id" | "created_at">) => Promise<void>;
  updateInventoryCountFromList: (id: string, updatedCount: Omit<InventoryCount, "id" | "created_at">) => Promise<void>;
  deleteInventoryCountFromList: (id: string) => Promise<void>;
}

export const InventoryCountContext = createContext<InventoryCountContextType | undefined>(
  undefined
);

interface InventoryCountProviderProps {
  children: ReactNode;
}

export const InventoryCountProvider = ({ children }: InventoryCountProviderProps) => {
  const [inventoryCountList, setInventoryCountList] = useState<InventoryCount[]>([]);
  const inventoryCountCollectionRef = collection(db, "inventoryCountList")

  useEffect(() => {
    const unsubscribe = onSnapshot(inventoryCountCollectionRef, (snapshot) => {
      const fetchedInventoryCountList: InventoryCount[] = snapshot.docs.map(
        (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          created_at: doc.data()?.createdAt?.toDate().getTime() || Date.now(),
        } as InventoryCount))
      const orderedInventoryCount = [...fetchedInventoryCountList].sort((a, b) => b.created_at - a.created_at)
      setInventoryCountList(orderedInventoryCount)
    })
    return () => unsubscribe();
  })

  const addInventoryCountToList = async (inventoryCountData: Omit<InventoryCount, "id" | "created_at">) => {
    const newInventoryCountDocRef = doc(inventoryCountCollectionRef);
    const newInventoryCount: InventoryCount = {
      id: newInventoryCountDocRef.id,
      ...inventoryCountData,
      created_at: Date.now()
    }
    await setDoc(newInventoryCountDocRef, {
      owner: newInventoryCount.owner,
      name: newInventoryCount.name,
      created_at: Timestamp.now(),
      products: newInventoryCount.products
    })
  };

  const updateInventoryCountFromList = async (id: string, updatedInventoryCountData: Omit<InventoryCount, "id" | "created_at">) => {
    const inventoryCountDocRef = doc(db, "inventoryCountList", id);
    await setDoc(inventoryCountDocRef, {
      owner: updatedInventoryCountData.owner,
      name: updatedInventoryCountData.name,
      products: updatedInventoryCountData.products
    },
    {
      merge: true
    }
    )
  };

  const deleteInventoryCountFromList = async (id: string) => {
    const inventoryCountDocRef = doc(db, "inventoryCountList", id);
    await deleteDoc(inventoryCountDocRef);
  };

  return (
    <InventoryCountContext.Provider
      value={{
        inventoryCountList,
        addInventoryCountToList,
        updateInventoryCountFromList,
        deleteInventoryCountFromList,
      }}
    >
      {children}
    </InventoryCountContext.Provider>
  );
};

export const useInventoryCount = () => {
  const context = useContext(InventoryCountContext);
  if (!context) {
    throw new Error("useInventoryCount must be used within an InventoryCountProvider");
  }
  return context;
};
