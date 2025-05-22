import { Product, ProductFormData, ProductFilters } from "@/models/product.model";
import { ApiService } from "./api.service";
import { ApiResponse } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";
import { config } from "@/config/env";
import { withUserId, getCurrentUserId } from "@/utils/withUserId";

export class ProductService extends ApiService {
  constructor() {
    super();
  }
  
  // Get all products
  async getProducts(filters?: ProductFilters): Promise<ApiResponse<Product[]>> {
    let query = this.supabase.from("products").select("*");

    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.minPrice) {
      query = query.gte("price", filters.minPrice);
    }

    if (filters?.maxPrice) {
      query = query.lte("price", filters.maxPrice);
    }

    if (filters?.sortBy) {
      const sortColumn = filters.sortBy === "name" ? "name" : filters.sortBy === "price" ? "price" : "stock";
      query = query.order(sortColumn, { ascending: filters.sortOrder === "asc" });
    }

    try {
      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        return { error: "Failed to fetch products" };
      }

      return { data: data as Product[] };
    } catch (error) {
      console.error("Unexpected error fetching products:", error);
      return { error: "An unexpected error occurred" };
    }
  }

  // Create a new product
  async createProduct(productData: ProductFormData): Promise<ApiResponse<Product>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newProduct: Product = {
        id: Math.floor(Math.random() * 1000),
        name: productData.name,
        price: productData.price,
        stock: productData.stock,
        description: productData.description,
        details: productData.details,
        how_to_use: productData.how_to_use,
        ingredients: productData.ingredients,
      };

      return { data: newProduct };
    }
    
    try {
      // Add the current user_id to the product data
      const productWithUserId = withUserId(productData);
      
      const { data, error } = await supabase
        .from("products")
        .insert([productWithUserId])
        .select()
        .single();

      if (error) throw error;
      
      return { data: data as Product };
    } catch (error) {
      console.error("Error creating product:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to create product",
      };
    }
  }

  // Get product by ID
  async getProductById(id: number): Promise<ApiResponse<Product | null>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Mock Product 1",
          price: 25.00,
          stock: 50,
          description: "This is a mock product for testing.",
          details: "Mock details",
          how_to_use: "Mock instructions",
          ingredients: "Mock ingredients",
        },
        {
          id: 2,
          name: "Mock Product 2",
          price: 49.99,
          stock: 100,
          description: "Another mock product for testing purposes.",
          details: "More mock details",
          how_to_use: "More mock instructions",
          ingredients: "More mock ingredients",
        },
      ];

      const foundProduct = mockProducts.find((product) => product.id === id);
      return { data: foundProduct || null };
    }

    try {
      const { data, error } = await this.supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        return { error: "Failed to fetch product" };
      }

      return { data: data as Product };
    } catch (error) {
      console.error("Unexpected error fetching product:", error);
      return { error: "An unexpected error occurred" };
    }
  }

  // Update an existing product
  async updateProduct(id: number, productData: Partial<ProductFormData>): Promise<ApiResponse<Product>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedProduct: Product = {
        id: id,
        name: productData.name || "Updated Mock Product",
        price: productData.price || 30.00,
        stock: productData.stock || 40,
        description: productData.description || "Updated mock description",
        details: productData.details || "Updated mock details",
        how_to_use: productData.how_to_use || "Updated mock instructions",
        ingredients: productData.ingredients || "Updated mock ingredients",
      };

      return { data: updatedProduct };
    }

    try {
      const { data, error } = await this.supabase
        .from("products")
        .update(productData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating product:", error);
        return { error: "Failed to update product" };
      }

      return { data: data as Product };
    } catch (error) {
      console.error("Unexpected error updating product:", error);
      return { error: "An unexpected error occurred" };
    }
  }

  // Delete a product
  async deleteProduct(id: number): Promise<ApiResponse<boolean>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { data: true };
    }

    try {
      const { error } = await this.supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting product:", error);
        return { error: "Failed to delete product" };
      }

      return { data: true };
    } catch (error) {
      console.error("Unexpected error deleting product:", error);
      return { error: "An unexpected error occurred" };
    }
  }
}

// Create a singleton instance
export const productService = new ProductService();
