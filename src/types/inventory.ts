export type InventoryCount = {
  id: string;
  owner: string;
  name: string;
  created_at: number;
  products: Product[];
};

export type Product = {
  name: string;
  code: string;
  quantity: number;
};
