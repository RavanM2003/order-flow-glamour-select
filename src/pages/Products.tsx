
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/models/product.model";
import { Skeleton } from "@/components/ui/skeleton";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const productsPerPage = 6;
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async (reset = false) => {
    const currentPage = reset ? 1 : page;
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .range((currentPage - 1) * productsPerPage, currentPage * productsPerPage - 1)
        .order('id', { ascending: false });
      
      if (error) {
        console.error("Error fetching products:", error);
        return;
      }
      
      if (data) {
        if (reset) {
          setProducts(data);
          setPage(2);
        } else {
          setProducts(prev => [...prev, ...data]);
          setPage(currentPage + 1);
        }
        
        setHasMore(data.length === productsPerPage);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Reset products and fetch based on search term
    if (value) {
      searchProducts(value);
    } else {
      fetchProducts(true);
    }
  };
  
  const searchProducts = async (term: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${term}%`)
        .limit(productsPerPage);
      
      if (error) {
        console.error("Error searching products:", error);
        return;
      }
      
      if (data) {
        setProducts(data);
        setHasMore(false); // Disable load more during search
      }
    } catch (error) {
      console.error("Failed to search products:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredProducts = products;
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <h1 className="text-4xl font-bold text-glamour-800 mb-2">Məhsullar</h1>
        <p className="text-lg text-gray-600 mb-6 max-w-3xl">
          Gündəlik qulluq və gözəllik rutini üçün premium məhsullarımızı kəşf edin.
        </p>
        
        <div className="flex mb-8">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Məhsulları axtar..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-glamour-600">Məhsul şəkli</p>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-glamour-800">{product.name}</h2>
                  <div className="text-glamour-700 font-semibold">{product.price} AZN</div>
                </div>
                <p className="text-gray-600 mb-6 line-clamp-3">{product.description}</p>
                <Button className="w-full bg-glamour-700 hover:bg-glamour-800" asChild>
                  <Link to={`/products/${product.id}`}>
                    Ətraflı bax
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
          
          {loading && (
            <>
              {[1, 2, 3].map((index) => (
                <div key={`skeleton-${index}`} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-6" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">Axtarışınıza uyğun məhsul tapılmadı.</p>
            <Button 
              variant="link" 
              className="text-glamour-700" 
              onClick={() => {
                setSearchTerm("");
                fetchProducts(true);
              }}
            >
              Axtarışı təmizlə
            </Button>
          </div>
        )}
        
        {hasMore && !searchTerm && (
          <div className="mt-8 text-center">
            <Button 
              onClick={() => fetchProducts()}
              disabled={loading}
              variant="outline"
            >
              {loading ? "Yüklənir..." : "Daha çox göstər"}
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Products;
