import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "./ui/pagination";
import { MapPin, Grid3X3, List, Building2, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { PropertyFiltersDialog } from "./shared/PropertyFiltersDialog";

import { usePropertyFilters } from "../hooks/usePropertyFilters";

// Interfaces
interface Property {
  id: number;
  externalId?: number; // Added for consistent navigation
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
  development_status: string; // Development status from complete property data
  completion_datetime: string;
  coordinates: string;
  description: string;
  featured: boolean;
  reelly_status: boolean;
  cacheExpiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AllPropertiesPageProps {
  onProjectSelect: (project: Property) => void;
  onBack: () => void;
  selectedDeveloper?: { name: string };
}

export function AllPropertiesPage({
  onProjectSelect,
  onBack,
  selectedDeveloper,
}: AllPropertiesPageProps) {
  // Use the shared filter hook
  const {
    appliedFilters,
    searchTerm,
    handleSearchChange,
    handleFiltersChange,
    resetFilters,
    getActiveFilterCount,
    initializeFiltersState,
  } = usePropertyFilters({
    storageKey: "allPropertiesFilters",
  });

  // State management
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersInitialized, setFiltersInitialized] = useState(false);

  // Ref to track if filters have been initialized to prevent infinite loops
  const hasInitializedFilters = useRef(false);

  // Ref to store the latest fetchProperties function to avoid dependency issues
  const fetchPropertiesRef = useRef<
    ((page?: number, limit?: number) => Promise<void>) | null
  >(null);

  // Ref to track API call count for debugging
  const apiCallCount = useRef(0);

  // Ref to prevent API calls when already loading
  const isLoadingRef = useRef(false);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Fetch properties from API with server-side pagination
  const fetchProperties = useCallback(
    async (page: number = 1, limit: number = 12) => {
      // Prevent multiple simultaneous API calls
      if (isLoadingRef.current) {
        // console.log("⏸️ Skipping API call - already loading");
        return;
      }

      // Track API calls for debugging
      apiCallCount.current += 1;
      // console.log(
      //   `🔄 API Call #${apiCallCount.current} - Fetching properties (page: ${page}, limit: ${limit})`
      // );

      isLoadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        // Build query parameters for server-side pagination and filtering
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        // Add sorting parameter - map frontend values to backend values
        if (sortBy) {
          let backendSortValue = sortBy;
          switch (sortBy) {
            case "price-low":
              backendSortValue = "price_min_to_max";
              break;
            case "price-high":
              backendSortValue = "price_max_to_min";
              break;
            case "location":
              backendSortValue = "name_asc"; // Location sorting by area name
              break;
            case "featured":
              backendSortValue = "featured";
              break;
            case "latest":
              backendSortValue = "latest";
              break;
            default:
              // Don't default to featured - let backend handle default sorting based on filters
              backendSortValue = "";
          }
          if (backendSortValue) {
            params.append("sort", backendSortValue);
          }
        }

        // Add filter parameters (use appliedFilters for API calls)
        if (appliedFilters.searchTerm) {
          params.append("name", appliedFilters.searchTerm);
        }
        if (appliedFilters.priceRange[0] > 0) {
          params.append("min_price", appliedFilters.priceRange[0].toString());
        }
        if (appliedFilters.priceRange[1] < 20000000) {
          params.append("max_price", appliedFilters.priceRange[1].toString());
        }
        if (appliedFilters.areaRange[0] > 0) {
          params.append("min_area", appliedFilters.areaRange[0].toString());
        }
        if (appliedFilters.areaRange[1] < 50000) {
          params.append("max_area", appliedFilters.areaRange[1].toString());
        }
        if (appliedFilters.developmentStatus.length > 0) {
          params.append(
            "development_status",
            appliedFilters.developmentStatus.join(",")
          );
        }
        if (appliedFilters.salesStatus.length > 0) {
          params.append("sale_status", appliedFilters.salesStatus.join(","));
        }
        if (appliedFilters.unitType.length > 0) {
          params.append("unit_type", appliedFilters.unitType.join(","));
        }

        if (appliedFilters.bedrooms.length > 0) {
          params.append("bedrooms", appliedFilters.bedrooms.join(","));
        }

        // Add featured filter parameter
        if (appliedFilters.featured !== null) {
          params.append("featured", appliedFilters.featured.toString());
        }

        // Add completion timeframe parameter - map frontend values to backend values
        if (
          appliedFilters.completionTimeframe &&
          appliedFilters.completionTimeframe !== "all"
        ) {
          let backendTimeframeValue = appliedFilters.completionTimeframe;
          switch (appliedFilters.completionTimeframe) {
            case "within_6m":
              backendTimeframeValue = "6_months";
              break;
            case "within_12m":
              backendTimeframeValue = "12_months";
              break;
            case "within_24m":
              backendTimeframeValue = "24_months";
              break;
            case "beyond_24m":
              backendTimeframeValue = "beyond_24_months";
              break;
          }
          params.append("completion_period", backendTimeframeValue);
        }

        const response = await axios.get(
          `/api/properties?${params.toString()}`
        );
        const data = response.data;

        if (data.success && data.data) {
          const fetchedProperties = data.data || [];
          setProperties(fetchedProperties);
          if (data.pagination) {
            setPagination({
              page: data.pagination.page,
              limit: data.pagination.limit,
              total: data.pagination.total,
              totalPages: data.pagination.totalPages,
            });
          }
          // console.log(
          //   `✅ Fetched ${fetchedProperties.length} properties (page ${page}/${
          //     data.pagination?.totalPages || 1
          //   })`
          // );
          // console.log("📊 Pagination info:", data.pagination);
          // console.log(
          //   "🔍 API URL called:",
          //   `/api/properties?${params.toString()}`
          // );
        } else {
          setProperties([]);
          setPagination({ page: 1, limit: 12, total: 0, totalPages: 0 });
        }
      } catch (err) {
        console.error("❌ Error fetching properties:", err);
        if (axios.isAxiosError(err)) {
          setError(
            `Failed to fetch properties: ${err.response?.status || err.message}`
          );
        } else {
          setError(
            err instanceof Error ? err.message : "Failed to fetch properties"
          );
        }
        setProperties([]);
        setPagination({ page: 1, limit: 12, total: 0, totalPages: 0 });
      } finally {
        isLoadingRef.current = false;
        setLoading(false);
      }
    },
    [appliedFilters, sortBy]
  ); // Dependencies for useCallback

  // Store the latest fetchProperties function in ref to avoid dependency issues
  fetchPropertiesRef.current = fetchProperties;

  // Handle page change with server-side pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) {
      console.warn(`⚠️ Invalid page number: ${page}`);
      return;
    }

    // Fetch new page from server
    fetchProperties(page, pagination.limit);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Apply filters and sorting - trigger new API call with server-side filtering
  useEffect(() => {
    // console.log(
    //   "🔄 useEffect triggered - filtersInitialized:",
    //   filtersInitialized
    // );
    // Only fetch if filters have been initialized to avoid race conditions
    if (filtersInitialized && fetchPropertiesRef.current) {
      // console.log("✅ Conditions met - fetching properties");
      fetchPropertiesRef.current(1, 12); // Use fixed limit instead of pagination.limit to avoid dependency loop
    } else {
      // console.log("⏸️ Skipping fetch - conditions not met");
    }
  }, [appliedFilters, sortBy, filtersInitialized]); // Only depend on actual filter/sort changes

  // Initialize filters on component mount
  useEffect(() => {
    if (!hasInitializedFilters.current) {
      // console.log("🚀 AllPropertiesPage: Initial load - initializing filters");
      initializeFiltersState();
      // Mark filters as initialized to trigger the first fetch
      setFiltersInitialized(true);
      hasInitializedFilters.current = true;
    }
  }, [initializeFiltersState]); // Safe to include now with the ref guard

  // Format price display
  const formatPrice = (property: Property) => {
    const currency = property.price_currency || "AED";

    if (property.min_price && property.max_price) {
      if (property.min_price === property.max_price) {
        return `${currency} ${property.min_price.toLocaleString()}`;
      }
      return `${currency} ${property.min_price.toLocaleString()} - ${property.max_price.toLocaleString()}`;
    }

    if (property.min_price) {
      return `From ${currency} ${property.min_price.toLocaleString()}`;
    }

    if (property.max_price) {
      return `Up to ${currency} ${property.max_price.toLocaleString()}`;
    }

    return "Price on Request";
  };

  // Get image URL from JSON string
  const getImageUrl = (coverImageUrl?: string) => {
    if (!coverImageUrl) return "/placeholder-property.jpg";

    try {
      const parsed = JSON.parse(coverImageUrl);
      return parsed.url || "/placeholder-property.jpg";
    } catch {
      return "/placeholder-property.jpg";
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-beige shadow-sm flex-shrink-0">
        <div className="container py-6">
          <h1 className="text-4xl text-[#8b7355] mb-2">
            {selectedDeveloper ? selectedDeveloper.name : "All Properties"}
          </h1>
          <p className="text-warm-gray">
            {pagination.total} properties found • Page {pagination.page} of{" "}
            {pagination.totalPages}
          </p>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mt-6">
            {/* Controls */}
            <div className="flex items-center space-x-3 w-full">
              {/* Property Filters Dialog Component */}
              <PropertyFiltersDialog
                appliedFilters={appliedFilters}
                searchTerm={searchTerm}
                onFiltersChange={handleFiltersChange}
                onSearchChange={handleSearchChange}
                getActiveFilterCount={getActiveFilterCount}
                resetFilters={resetFilters}
              />

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 border-[#8b7355]/30 rounded-xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex items-center border border-[#8b7355]/30 rounded-xl overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-none ${
                    viewMode === "grid"
                      ? "bg-[#8b7355] text-white"
                      : "text-[#8b7355]"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`rounded-none ${
                    viewMode === "list"
                      ? "bg-[#8b7355] text-white"
                      : "text-[#8b7355]"
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8 flex-1">
        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="text-warm-gray">
              Loading properties
              {/* {pagination.page > 1 ? ` for page ${pagination.page}` : ""}... */}
            </div>
            <div className="mt-2 text-sm text-warm-gray/70">
              {/* {pagination.page > 1 &&
                `Fetching page ${pagination.page} of ${pagination.totalPages}`} */}
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">{error}</div>
            <Button
              onClick={() => fetchProperties()}
              className="bg-gold hover:bg-gold/90 text-charcoal"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* No Properties */}
        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-warm-gray mx-auto mb-4" />
            <h3 className="text-xl text-[#8b7355] mb-2">No properties found</h3>
            <p className="text-warm-gray">
              Try adjusting your search criteria.
            </p>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && !error && properties.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Card
                key={property.id}
                className="group cursor-pointer border border-beige hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden rounded-xl"
                onClick={() => onProjectSelect(property)}
              >
                {/* Property Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={getImageUrl(property.cover_image_url)}
                    alt={property.name || "Property"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {property.featured ? (
                    <Badge className="absolute top-4 left-4 bg-[#D4AF37] text-text border-0">
                      {property.featured ? "Featured" : ""}
                    </Badge>
                  ) : null}

                  {property.development_status ? (
                    <Badge className="absolute top-4 right-4 bg-black/60 text-white border-0">
                      {property.development_status}
                    </Badge>
                  ) : null}

                  {property.completion_datetime ? (
                    <Badge className="absolute bottom-4 left-4 bg-gold text-[#8b7355] px-2 py-1 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {property.completion_datetime
                        ? new Date(
                            property.completion_datetime
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })
                        : "TBD"}
                    </Badge>
                  ) : null}
                </div>

                {/* Property Details */}
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Title and Location */}
                    <div>
                      <h3 className="text-xl text-[#8b7355] group-hover:text-gold transition-colors">
                        {property.name || "Property Title"}
                      </h3>
                      <div className="flex items-center text-warm-gray mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          {property.area || "Location"}
                        </span>
                      </div>
                    </div>

                    {/* Price and Status */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl text-gold">
                        {formatPrice(property)}
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs border-gold/30 text-gold"
                      >
                        {property.sale_status || "Available"}
                      </Badge>
                    </div>

                    {/* Developer */}
                    <div className="pt-4 border-t border-beige">
                      <div className="text-sm text-warm-gray">
                        {property.developer || "Developer"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Properties List */}
        {!loading && !error && properties.length > 0 && viewMode === "list" && (
          <div className="space-y-6">
            {properties.map((property) => (
              <Card
                key={property.id}
                className="group cursor-pointer border border-beige hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl"
                onClick={() => onProjectSelect(property)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative w-full md:w-80 aspect-[4/3] md:aspect-auto md:h-48 overflow-hidden">
                      <ImageWithFallback
                        src={getImageUrl(property.cover_image_url)}
                        alt={property.name || "Property"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl text-[#8b7355] group-hover:text-gold transition-colors mb-2">
                            {property.name || "Property Title"}
                          </h3>
                          <div className="flex items-center text-warm-gray mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{property.area || "Location"}</span>
                            <span className="mx-2">•</span>
                            <span>{property.developer || "Developer"}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl text-gold mb-2">
                            {formatPrice(property)}
                          </div>
                          <Badge
                            variant="outline"
                            className="border-gold/30 text-gold"
                          >
                            {property.sale_status || "Available"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading &&
          !error &&
          properties.length > 0 &&
          (pagination.totalPages > 1 ||
            process.env.NODE_ENV === "development") && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {/* Previous Button */}
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (pagination.page > 1) {
                          handlePageChange(pagination.page - 1);
                        } else {
                        }
                      }}
                      className={
                        pagination.page <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* Page Numbers */}
                  {(() => {
                    const currentPage = pagination.page;
                    const totalPages = pagination.totalPages;
                    const pages: JSX.Element[] = [];

                    // Helper function to add page number
                    const addPage = (pageNum: number, key?: string) => {
                      pages.push(
                        <PaginationItem key={key || pageNum}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNum)}
                            isActive={pageNum === currentPage}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    };

                    // Helper function to add ellipsis
                    const addEllipsis = (key: string) => {
                      pages.push(
                        <PaginationItem key={key}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    };

                    // Always show first page
                    addPage(1);

                    if (totalPages <= 7) {
                      // If total pages <= 7, show all pages
                      for (let i = 2; i <= totalPages; i++) {
                        addPage(i);
                      }
                    } else {
                      // Complex pagination logic for format: 1 ... 3 4 5 ... 137
                      if (currentPage <= 3) {
                        // Current page is near the beginning: 1 2 3 4 5 ... 137
                        for (let i = 2; i <= 5; i++) {
                          addPage(i);
                        }
                        addEllipsis("end-ellipsis");
                        addPage(totalPages);
                      } else if (currentPage >= totalPages - 2) {
                        // Current page is near the end: 1 ... 133 134 135 136 137
                        addEllipsis("start-ellipsis");
                        for (let i = totalPages - 4; i <= totalPages; i++) {
                          addPage(i);
                        }
                      } else {
                        // Current page is in the middle: 1 ... 3 4 5 ... 137
                        addEllipsis("start-ellipsis");
                        for (
                          let i = currentPage - 1;
                          i <= currentPage + 1;
                          i++
                        ) {
                          addPage(i);
                        }
                        addEllipsis("end-ellipsis");
                        addPage(totalPages);
                      }
                    }

                    return pages;
                  })()}

                  {/* Next Button */}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (pagination.page < pagination.totalPages) {
                          handlePageChange(pagination.page + 1);
                        } else {
                        }
                      }}
                      className={
                        pagination.page >= pagination.totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
      </div>
    </div>
  );
}
