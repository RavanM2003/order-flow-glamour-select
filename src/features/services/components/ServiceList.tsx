
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Search, Clock, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Service } from "@/models/service.model";
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

const ServiceList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    fetchServices();
  }, [currentPage, searchTerm]);

  const fetchServices = async () => {
    if (searchTerm) {
      setSearchLoading(true);
    } else {
      setLoading(true);
    }

    try {
      let query = supabase
        .from("services")
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
        console.error("Error fetching services:", error);
        return;
      }

      if (data) {
        setServices(data as Service[]);
        setTotalCount(count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
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
    setCurrentPage(1); // Reset to first page when searching
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
              key={`service-skeleton-${index}`}
              className="bg-white rounded-lg overflow-hidden shadow-md"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-24 mb-4" />
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
            placeholder={t("services.search")}
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
            : `Cəmi ${totalCount} xidmət`
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={`service-item-${service.id}`}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative"
          >
            <DiscountBadge discount={service.discount || 0} />

            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {service.image_urls && service.image_urls.length > 0 ? (
                <img
                  src={service.image_urls[0]}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-glamour-600">Xidmət şəkli</p>
              )}
            </div>

            <div className="p-6 relative">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-glamour-800 flex-1 pr-4">
                  {service.name}
                </h2>
                <PriceDisplay
                  price={service.price}
                  discount={service.discount}
                  className="flex-shrink-0"
                />
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="mr-1 h-4 w-4" />
                <span>
                  {t("common.duration")}: {service.duration}{" "}
                  {t("common.minutes")}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {service.description || t("services.noDescription")}
              </p>

              {service.benefits && service.benefits.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-glamour-800 mb-2">
                    {t("services.benefits")}:
                  </h3>
                  <ul className="space-y-1">
                    {service.benefits.slice(0, 3).map((benefit, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-center"
                      >
                        <span className="text-glamour-700 mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                    {service.benefits.length > 3 && (
                      <li className="text-sm text-glamour-700">
                        +{service.benefits.length - 3}{" "}
                        {t("services.moreBenefits")}
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <Button
                className="w-full bg-glamour-700 hover:bg-glamour-800"
                asChild
              >
                <Link to={`/services/${service.id}`}>
                  {t("common.viewDetails")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              {/* Info Icon - bottom right */}
              <div className="absolute bottom-4 right-4">
                <Link 
                  to={`/services/${service.id}`}
                  className="text-glamour-600 hover:text-glamour-700 transition-colors"
                >
                  <Info className="h-4 w-4" />
                </Link>
              </div>
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

      {services.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            {searchTerm 
              ? `"${searchTerm}" üçün nəticə tapılmadı`
              : "Heç bir xidmət tapılmadı"
            }
          </p>
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-lg text-gray-600 mb-6">{t("services.cta")}</p>
        <Button
          size="lg"
          className="bg-glamour-700 hover:bg-glamour-800"
          asChild
        >
          <Link to="/booking">{t("services.bookNow")}</Link>
        </Button>
      </div>
    </div>
  );
};

export default ServiceList;
