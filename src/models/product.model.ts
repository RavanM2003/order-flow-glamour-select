
// Product model and related types
export interface Product {
  id?: number;
  name: string;
  price?: number;
  quantity?: number;
  description?: string;
  imageUrl?: string;
  categoryId?: number;
  isServiceRelated?: boolean;
  stock?: number;
}

export interface ProductFormData {
  name: string;
  price: number;
  description?: string;
  stock?: number;
  category?: string;
  imageUrl?: string;
  isServiceRelated?: boolean;
}
