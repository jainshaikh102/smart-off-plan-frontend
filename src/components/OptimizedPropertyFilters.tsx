"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Filter,
  Grid,
  Map,
  ChevronDown,
  Loader2,
  AlertCircle,
  RefreshCw,
  Activity,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  useOptimizedMapProperties,
  useOptimizedListProperties,
  usePerformanceMonitor,
} from "@/hooks/useOptimizedProperties";
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const OptimizedMapComponent = dynamic(
  () =>
    import("./map/OptimizedMapComponent").then(
      (mod) => mod.OptimizedMapComponent
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    ),
  }
);
import { PerformanceErrorBoundary } from "./ErrorBoundary";
import { PerformanceDashboard } from "./PerformanceDashboard";
import { useAppSelector } from "@/store";

interface Property {
  id: number;
  name: string;
  area: string;
  coordinates: string;
  developer: string;
  developer_logo?: string;
  min_price: number;
  max_price: number;
  price_currency: string;
  area_unit?: string;
  cover_image_url?: string;
  is_partner_project?: boolean;
  sale_status?: string;
  status?: string;
  development_status?: string;
  completion_datetime?: string;
  description?: string;
  featured?: boolean;
  pendingReview?: boolean;
  featureReason?: string[];
  reelly_status?: boolean;
  lastFeaturedAt?: string;
  lastFetchedAt?: Date;
  cacheExpiresAt?: Date;
  source?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

interface OptimizedPropertyFiltersProps {}

export function OptimizedPropertyFilters({}: OptimizedPropertyFiltersProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("map");
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [showPerformanceStats, setShowPerformanceStats] = useState(false);

  // Performance monitoring
  const { getPerformanceMetrics, getMemoryUsage } = usePerformanceMonitor();
  const performanceStats = useAppSelector((state) => state.properties);

  // Optimized data fetching
  const {
    properties: mapProperties,
    loading: mapLoading,
    error: mapError,
    hasMore: mapHasMore,
    loadNextBatch,
    refreshData: refreshMapData,
    totalPages: mapTotalPages,
    currentPage: mapCurrentPage,
  } = useOptimizedMapProperties();

  const {
    properties: listProperties,
    loading: listLoading,
    error: listError,
    hasMore: listHasMore,
    loadMore: loadMoreList,
    refreshData: refreshListData,
  } = useOptimizedListProperties();

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-load next batch for map with throttling
  useEffect(() => {
    if (!mapLoading && mapHasMore && mapProperties.length < 500) {
      const timer = setTimeout(() => {
        loadNextBatch();
      }, 2000); // 2 second delay between batches

      return () => clearTimeout(timer);
    }
  }, [mapLoading, mapHasMore, mapProperties.length, loadNextBatch]);

  // Performance monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      const metrics = getPerformanceMetrics();
      if (metrics.memoryUsage && metrics.memoryUsage.used > 100) {
        console.warn("⚠️ High memory usage detected:", metrics.memoryUsage);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [getPerformanceMetrics]);

  // Memoized handlers
  const handlePropertyHover = useCallback((property: Property | null) => {
    setHoveredProperty(property);
  }, []);

  const handlePropertyClick = useCallback(
    (property: Property) => {
      router.push(`/properties/${property.id}`);
    },
    [router]
  );

  const handleRefresh = useCallback(() => {
    if (viewMode === "map") {
      refreshMapData();
    } else {
      refreshListData();
    }
  }, [viewMode, refreshMapData, refreshListData]);

  // Memoized property lists
  const displayProperties = useMemo(() => {
    return viewMode === "map" ? mapProperties : listProperties;
  }, [viewMode, mapProperties, listProperties]);

  const isLoading = useMemo(() => {
    return viewMode === "map" ? mapLoading : listLoading;
  }, [viewMode, mapLoading, listLoading]);

  const error = useMemo(() => {
    return viewMode === "map" ? mapError : listError;
  }, [viewMode, mapError, listError]);

  // Get image URL from JSON string
  const getImageUrl = useCallback((coverImageUrl?: string) => {
    if (!coverImageUrl) return "/placeholder-property.jpg";
    try {
      const parsed = JSON.parse(coverImageUrl);
      return parsed.url || "/placeholder-property.jpg";
    } catch {
      return "/placeholder-property.jpg";
    }
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gold" />
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <PerformanceErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  Properties ({displayProperties.length})
                </h1>
                {isLoading && (
                  <Loader2 className="w-4 h-4 animate-spin text-gold" />
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* Performance Stats Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPerformanceStats(!showPerformanceStats)}
                  className="hidden md:flex"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Stats
                </Button>

                {/* Refresh Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      isLoading ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="px-3"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("map")}
                    className="px-3"
                  >
                    <Map className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        {showPerformanceStats && (
          <div className="bg-blue-50 border-b border-blue-200 p-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Map Properties:</span>{" "}
                  {performanceStats.mapProperties.length}
                </div>
                <div>
                  <span className="font-medium">List Properties:</span>{" "}
                  {performanceStats.listProperties.length}
                </div>
                <div>
                  <span className="font-medium">Memory:</span>{" "}
                  {getMemoryUsage()?.used || "N/A"} MB
                </div>
                <div>
                  <span className="font-medium">Cache Version:</span>{" "}
                  {performanceStats.cacheVersion}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 p-4">
            <div className="max-w-7xl mx-auto flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="ml-auto"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {viewMode === "map" ? (
            <div className="h-[calc(100vh-200px)] rounded-lg overflow-hidden border border-gray-200">
              <OptimizedMapComponent
                properties={mapProperties}
                onPropertyHover={handlePropertyHover}
                onPropertyClick={handlePropertyClick}
                hoveredProperty={hoveredProperty}
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Property List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listProperties.map((property) => (
                  <Card
                    key={property.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      hoveredProperty?.id === property.id
                        ? "border-gold shadow-lg bg-gold/5"
                        : ""
                    }`}
                    onClick={() => handlePropertyClick(property)}
                    onMouseEnter={() => handlePropertyHover(property)}
                    onMouseLeave={() => handlePropertyHover(null)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <ImageWithFallback
                          src={getImageUrl(property.cover_image_url)}
                          alt={property.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="mb-1 truncate text-sm text-gray-900">
                            {property.name}
                          </h4>
                          <div className="flex items-center text-gray-500 text-xs mb-1">
                            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{property.area}</span>
                          </div>
                          <div className="text-gold mb-2 text-sm font-medium">
                            {property.price_currency}{" "}
                            {property.min_price?.toLocaleString()} -{" "}
                            {property.max_price?.toLocaleString()}
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              {property.developer}
                            </Badge>
                            {property.featured && (
                              <Badge
                                variant="default"
                                className="text-xs bg-gold"
                              >
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More Button */}
              {listHasMore && (
                <div className="text-center py-8">
                  <Button
                    onClick={loadMoreList}
                    disabled={listLoading}
                    className="px-8"
                  >
                    {listLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More Properties"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Performance Dashboard */}
        <PerformanceDashboard />
      </div>
    </PerformanceErrorBoundary>
  );
}
