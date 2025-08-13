"use client";

import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setMapLoading,
  setMapProperties,
  appendMapProperties,
  setMapError,
  setMapPagination,
  setListLoading,
  setListProperties,
  appendListProperties,
  setListError,
  setListPagination,
  optimizeCache,
} from "@/store/slices/propertySlice";
import axios from "axios";
import { useCallback, useEffect } from "react";

interface Property {
  id: number;
  name: string;
  area: string;
  area_unit: string;
  cover_image_url: string;
  developer: string;
  is_partner_project: boolean;
  min_price: number;
  max_price: number;
  price_currency: string;
  sale_status: string;
  status: string;
  development_status: string;
  completion_datetime: string;
  coordinates: string;
  description: string;
  featured: boolean;
  pendingReview: boolean;
  featureReason: string[];
  reelly_status: boolean;
  lastFeaturedAt?: string;
  lastFetchedAt: Date;
  cacheExpiresAt: Date;
  source: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  developer_logo?: string;
}

interface ApiResponse {
  success: boolean;
  data: Property[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
  };
}

// Query keys for React Query
export const propertyQueryKeys = {
  all: ["properties"] as const,
  lists: () => [...propertyQueryKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...propertyQueryKeys.lists(), filters] as const,
  maps: () => [...propertyQueryKeys.all, "map"] as const,
  mapBatch: (page: number, limit: number) =>
    [...propertyQueryKeys.maps(), "batch", page, limit] as const,
};

// Fetch function for map properties with batch loading
const fetchMapPropertiesBatch = async (
  page: number,
  limit: number = 100
): Promise<ApiResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await axios.get(
    `/api/properties/batch-100?${params.toString()}`
  );
  return response.data;
};

// Fetch function for list properties
const fetchListProperties = async (
  page: number,
  limit: number = 12,
  filters: Record<string, any> = {}
): Promise<ApiResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  });

  const response = await axios.get(`/api/properties?${params.toString()}`);
  return response.data;
};

// Hook for optimized map properties with infinite loading
export const useOptimizedMapProperties = () => {
  const dispatch = useAppDispatch();
  const { mapProperties, mapLoading, mapError, mapLastFetch } = useAppSelector(
    (state) => state.properties
  );
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: propertyQueryKeys.maps(),
    queryFn: ({ pageParam = 1 }) => fetchMapPropertiesBatch(pageParam, 100),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 8 * 60 * 60 * 1000, // 8 hours - data stays fresh
    gcTime: 12 * 60 * 60 * 1000, // 12 hours - keep in memory
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Update Redux store when data changes
  useEffect(() => {
    if (data?.pages) {
      const allProperties = data.pages.flatMap((page) => page.data);
      dispatch(setMapProperties(allProperties));

      // Update pagination info from the last page
      const lastPage = data.pages[data.pages.length - 1];
      if (lastPage?.pagination) {
        dispatch(
          setMapPagination({
            page: lastPage.pagination.page,
            hasMore: lastPage.pagination.page < lastPage.pagination.totalPages,
          })
        );
      }
    }
  }, [data, dispatch]);

  // Update loading state
  useEffect(() => {
    dispatch(setMapLoading(isLoading || isFetchingNextPage));
  }, [isLoading, isFetchingNextPage, dispatch]);

  // Update error state
  useEffect(() => {
    dispatch(setMapError(error ? error.message : null));
  }, [error, dispatch]);

  // Optimize cache periodically
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(optimizeCache());
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [dispatch]);

  const loadNextBatch = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: propertyQueryKeys.maps() });
    refetch();
  }, [queryClient, refetch]);

  return {
    properties: mapProperties,
    loading: isLoading || isFetchingNextPage,
    error: mapError,
    hasMore: hasNextPage,
    loadNextBatch,
    refreshData,
    totalPages: data?.pages[data.pages.length - 1]?.pagination.totalPages || 0,
    currentPage: data?.pages[data.pages.length - 1]?.pagination.page || 0,
    lastFetch: mapLastFetch,
  };
};

// Hook for optimized list properties with infinite loading
export const useOptimizedListProperties = (
  filters: Record<string, any> = {}
) => {
  const dispatch = useAppDispatch();
  const { listProperties, listLoading, listError } = useAppSelector(
    (state) => state.properties
  );
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: propertyQueryKeys.list(filters),
    queryFn: ({ pageParam = 1 }) => fetchListProperties(pageParam, 12, filters),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 8 * 60 * 60 * 1000, // 8 hours - same as map for consistency
    gcTime: 12 * 60 * 60 * 1000, // 12 hours - keep in memory
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Update Redux store when data changes
  useEffect(() => {
    if (data?.pages) {
      const allProperties = data.pages.flatMap((page) => page.data);
      dispatch(setListProperties(allProperties));

      // Update pagination info from the last page
      const lastPage = data.pages[data.pages.length - 1];
      if (lastPage?.pagination) {
        dispatch(
          setListPagination({
            page: lastPage.pagination.page,
            hasMore: lastPage.pagination.page < lastPage.pagination.totalPages,
          })
        );
      }
    }
  }, [data, dispatch]);

  // Update loading state
  useEffect(() => {
    dispatch(setListLoading(isLoading || isFetchingNextPage));
  }, [isLoading, isFetchingNextPage, dispatch]);

  // Update error state
  useEffect(() => {
    dispatch(setListError(error ? error.message : null));
  }, [error, dispatch]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: propertyQueryKeys.list(filters),
    });
    refetch();
  }, [queryClient, refetch, filters]);

  return {
    properties: listProperties,
    loading: isLoading || isFetchingNextPage,
    error: listError,
    hasMore: hasNextPage,
    loadMore,
    refreshData,
    totalPages: data?.pages[data.pages.length - 1]?.pagination.totalPages || 0,
    currentPage: data?.pages[data.pages.length - 1]?.pagination.page || 0,
  };
};

// Hook for performance monitoring
export const usePerformanceMonitor = () => {
  const { totalPropertiesLoaded, lastPerformanceCheck } = useAppSelector(
    (state) => state.properties
  );

  const getMemoryUsage = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      "performance" in window &&
      "memory" in (window.performance as any)
    ) {
      const memory = (window.performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      };
    }
    return null;
  }, []);

  const getPerformanceMetrics = useCallback(() => {
    return {
      totalPropertiesLoaded,
      lastPerformanceCheck,
      memoryUsage: getMemoryUsage(),
      timestamp: Date.now(),
    };
  }, [totalPropertiesLoaded, lastPerformanceCheck, getMemoryUsage]);

  return {
    getPerformanceMetrics,
    getMemoryUsage,
  };
};
