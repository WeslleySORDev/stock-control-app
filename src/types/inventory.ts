export type Stock = {
  id: string;
  owner: string;
  name: string;
  created_at: string;
  products: Product[];
  product_count: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  code: string;
  quantity: number;
};
