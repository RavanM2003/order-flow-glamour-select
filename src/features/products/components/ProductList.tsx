
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Search, Package, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Product } from "@/models/product.model";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import DiscountBadge from "@/components/ui/discount-badge";
import PriceDisplay from "@/components/ui/price-display";
import { useLanguage } from "@/context/LanguageContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 6;

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  const fetchProducts = async () => {
    if (searchTerm) {
      setSearchLoading(true);
    } else {
      setLoading(true);
    }

    try {
      let query = supabase
        .from("products")
        .select("*", { count: 'exact' })
        .order("discount", { ascending: false })
        .order("created_at", { ascending: false });

      // Server-side axtarış
      if (searchTerm.trim()) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // Pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      if (data) {
        setProducts(data as Product[]);
        setTotalCount(count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (loading && currentPage === 1) {
    return (
      <div>
        <div className="mb-8 max-w-md">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div
              key={`product-skeleton-${index}`}
              className="bg-white rounded-lg overflow-hidden shadow-md"
            >
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
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder={t("products.search")}
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
          {searchLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-glamour-700"></div>
            </div>
          )}
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {searchTerm 
            ? `"${searchTerm}" üçün ${totalCount} nəticə tapıldı`
            : `Cəmi ${totalCount} məhsul`
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={`product-item-${product.id}`}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative"
          >
            <DiscountBadge discount={product.discount || 0} />

            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-16 w-16 text-glamour-600" />
              )}
            </div>

            <div className="p-6 relative">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-glamour-800 flex-1 pr-4">
                  {product.name}
                </h2>
                <PriceDisplay
                  price={product.price}
                  discount={product.discount}
                  className="flex-shrink-0"
                />
              </div>

              <p className="text-gray-600 mb-6 line-clamp-3">
                {product.description || t("products.noDescription")}
              </p>

              <Button
                className="w-full bg-glamour-700 hover:bg-glamour-800"
                asChild
              >
                <Link to={`/products/${product.id}`}>
                  {t("common.viewDetails")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              {/* Info Icon - bottom right */}
              {/* <div className="absolute bottom-4 right-4">
                <Link 
                  to={`/products/${product.id}`}
                  className="text-glamour-600 hover:text-glamour-700 transition-colors"
                >
                  <Info className="h-4 w-4" />
                </Link>
              </div> */}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            {searchTerm 
              ? `"${searchTerm}" üçün nəticə tapılmadı`
              : "Heç bir məhsul tapılmadı"
            }
          </p>
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-lg text-gray-600 mb-6">{t("products.cta")}</p>
        <Button
          size="lg"
          className="bg-glamour-700 hover:bg-glamour-800"
          asChild
        >
          <Link to="/booking">{t("products.orderNow")}</Link>
        </Button>
      </div>
    </div>
  );
};

export default ProductList;
