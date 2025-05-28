
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

// Define valid table names that exist in our database
type ValidTableName = 'services' | 'products';

interface ServerSearchAndFilterProps<T> {
  tableName: ValidTableName;
  searchFields: string[];
  onFilteredDataChange: (data: T[]) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  placeholder?: string;
  initialData?: T[];
}

function ServerSearchAndFilter<T extends { id: number; name: string }>({
  tableName,
  searchFields,
  onFilteredDataChange,
  currentPage,
  onPageChange,
  itemsPerPage = 6,
  placeholder,
  initialData = []
}: ServerSearchAndFilterProps<T>) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [allLoadedData, setAllLoadedData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Server-side search function
  const performServerSearch = async (term: string, page: number): Promise<T[]> => {
    try {
      setIsLoading(true);
      let query = supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .order('name');

      if (term.trim()) {
        const searchConditions = searchFields.map(field => `${field}.ilike.%${term}%`).join(',');
        query = query.or(searchConditions);
      }

      const limit = itemsPerPage;
      const from = (page - 1) * limit;
      query = query.range(from, from + limit - 1);

      const { data, error, count } = await query;
      
      if (error) throw error;
      
      setTotalCount(count || 0);
      return (data as unknown) as T[];
    } catch (error) {
      console.error('Server search error:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search with server-side functionality
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    onPageChange(1);
    const results = await performServerSearch(term, 1);
    setAllLoadedData(results);
    onFilteredDataChange(results);
  };

  // Handle load more with append functionality
  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    const newResults = await performServerSearch(searchTerm, nextPage);
    onPageChange(nextPage);
    const updatedData = [...allLoadedData, ...newResults];
    setAllLoadedData(updatedData);
    onFilteredDataChange(updatedData);
  };

  // Initialize with default data
  useEffect(() => {
    if (initialData.length > 0 && allLoadedData.length === 0) {
      setAllLoadedData(initialData);
      onFilteredDataChange(initialData);
      setTotalCount(initialData.length);
    }
  }, [initialData, allLoadedData.length, onFilteredDataChange]);

  const hasMore = allLoadedData.length < totalCount;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={placeholder || t('common.search')}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? t('common.loading') : `${t('booking.loadMore')} (${allLoadedData.length}/${totalCount})`}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ServerSearchAndFilter;
