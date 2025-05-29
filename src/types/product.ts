export type Product = {
  id: string;
  name: string;
  description: string;
  code: string;
};

export type InventoryItem = {
  product: Product;
  quantity: number;
};

export type InventoryCount = {
  id: string;
  owner: string;
  name: string;
  date: string;
  items: InventoryItem[];
  total: number;
};
