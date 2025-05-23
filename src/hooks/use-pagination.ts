
import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage: number;
  initialPage?: number;
}

export function usePagination<T>({ items, itemsPerPage, initialPage = 1 }: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginatedItems = useMemo(() => {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const hasMore = currentPage * itemsPerPage < items.length;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const loadMore = () => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const reset = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    paginatedItems,
    hasMore,
    totalPages,
    loadMore,
    reset,
    setCurrentPage
  };
}
