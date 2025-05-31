import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Service } from "@/models/service.model";
import { useLanguage } from "@/context/LanguageContext";

interface ServiceSearchAndFilterProps {
  services: Service[];
  onFilteredServicesChange: (services: Service[]) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch?: (term: string) => Promise<void>;
  servicesPerPage?: number;
}

const ServiceSearchAndFilter: React.FC<ServiceSearchAndFilterProps> = ({
  services,
  onFilteredServicesChange,
  currentPage,
  onPageChange,
  onSearch,
  servicesPerPage = 6,
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = useMemo(() => {
    if (!searchTerm.trim()) {
      return services;
    }

    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description &&
          service.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [services, searchTerm]);

  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * servicesPerPage;
    const endIndex = startIndex + servicesPerPage;
    return filteredServices.slice(0, endIndex); // Show cumulative results instead of pagination
  }, [filteredServices, currentPage, servicesPerPage]);

  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
  const hasMore = currentPage < totalPages;

  React.useEffect(() => {
    onFilteredServicesChange(paginatedServices);
  }, [paginatedServices, onFilteredServicesChange]);

  const handleLoadMore = () => {
    if (hasMore) {
      onPageChange(currentPage + 1);
    }
  };

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    onPageChange(1); // Reset to first page when searching

    if (onSearch) {
      await onSearch(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={t("services.search")}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {paginatedServices.length < filteredServices.length && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={!hasMore}
          >
            {t("common.loadMore")} ({paginatedServices.length}/
            {filteredServices.length})
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceSearchAndFilter;
