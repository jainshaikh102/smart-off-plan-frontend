"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Building2,
  Loader2,
  Search,
  Grid3X3,
  List,
  RotateCcw,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import axios from "axios";

// Skeleton Loading Component for Property Cards
const PropertyCardSkeleton = () => {
  return (
    <Card className="border border-beige overflow-hidden rounded-xl animate-pulse">
      {/* Property Image skeleton */}
      <div className="relative aspect-[4/3] bg-gray-200">
        {/* Badge skeleton */}
        <div className="absolute top-4 right-4 w-20 h-6 bg-gray-300 rounded"></div>
      </div>

      {/* Property Details skeleton */}
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Title and Location skeleton */}
          <div>
            <div className="h-6 bg-gray-200 rounded mb-1 w-3/4"></div>
            <div className="flex items-center mt-1">
              <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>

          {/* Price and Status skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
            <div className="w-16 h-5 bg-gray-200 rounded"></div>
          </div>

          {/* Developer skeleton */}
          <div className="pt-4 border-t border-beige">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Property interface for area page
interface Property {
  id: number | string;
  name: string;
  area: string;
  developer: string;
  min_price?: number;
  max_price?: number;
  price_currency: string;
  cover_image_url?: string;
  sale_status?: string;
  status?: string;
  completion_datetime?: string;
  is_partner_project?: boolean;
  featured?: boolean;
  reelly_status?: boolean;
  bedrooms?: string;
  bathrooms?: string;
  size?: string;
  roi?: string;
  coordinates?: [number, number];
  description?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AreaPageProps {}

export default function AreaPage({}: AreaPageProps) {
  const params = useParams();
  const router = useRouter();
  const areaName = decodeURIComponent(params.areaName as string);

  // State management
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12, // 12 items per page
    total: 0,
    totalPages: 0,
  });

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const startIndex = (page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    setProperties(filteredProperties.slice(startIndex, endIndex));
    setCurrentPage(page);
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navigation handlers
  const handlePageNavigation = (page: string) => {
    router.push(`/${page}`);
  };

  const handleLogoClick = () => {
    router.push("/");
  };

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

  // Apply search and sorting
  useEffect(() => {
    let result = [...allProperties];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.area.toLowerCase().includes(searchLower) ||
          p.developer.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "featured":
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.name.localeCompare(b.name);
        });
        break;
      case "price-low":
        result.sort((a, b) => {
          const priceA = a.min_price ?? 0;
          const priceB = b.min_price ?? 0;
          return priceA - priceB;
        });
        break;
      case "price-high":
        result.sort((a, b) => {
          const priceA = a.max_price ?? a.min_price ?? 0;
          const priceB = b.max_price ?? b.min_price ?? 0;
          return priceB - priceA;
        });
        break;
      case "location":
        result.sort((a, b) => {
          const areaA = a.area?.toLowerCase() || "";
          const areaB = b.area?.toLowerCase() || "";
          return areaA.localeCompare(areaB);
        });
        break;
      default:
        break;
    }

    setFilteredProperties(result);

    // Update pagination
    const newTotalPages = Math.ceil(result.length / pagination.limit);
    setPagination((prev) => ({
      ...prev,
      total: result.length,
      totalPages: newTotalPages,
      page: 1, // Reset to first page when filters change
    }));

    // Set properties for first page
    setProperties(result.slice(0, pagination.limit));
    setCurrentPage(1);
  }, [allProperties, searchTerm, sortBy, pagination.limit]);

  useEffect(() => {
    const fetchAreaProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🏙️ Fetching properties for area:", areaName);

        // Use the new /all endpoint with area filtering for better performance
        const response = await axios.get(
          `/api/properties/all?area=${encodeURIComponent(areaName)}`
        );

        if (response.data.success) {
          const areaProperties = response.data.data || [];
          console.log(
            `✅ Found ${areaProperties.length} properties in ${areaName}`
          );

          // Set all properties
          setAllProperties(areaProperties);
        } else {
          setError("Failed to fetch properties");
          setAllProperties([]);
        }
      } catch (err) {
        console.error("❌ Error fetching area properties:", err);
        setError("Failed to load properties");
        setAllProperties([]);
      } finally {
        setLoading(false);
      }
    };

    if (areaName) {
      fetchAreaProperties();
    }
  }, [areaName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation skeleton */}
        <div className="h-16 bg-white border-b border-beige animate-pulse">
          <div className="container flex items-center justify-between h-full">
            <div className="w-32 h-8 bg-gray-200 rounded"></div>
            <div className="flex space-x-6">
              <div className="w-20 h-6 bg-gray-200 rounded"></div>
              <div className="w-20 h-6 bg-gray-200 rounded"></div>
              <div className="w-20 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Header skeleton */}
        <div className="bg-white border-b border-beige">
          <div className="container py-6">
            <div className="w-64 h-10 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="w-48 h-5 bg-gray-200 rounded mb-6 animate-pulse"></div>

            {/* Search and Controls skeleton */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="h-10 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-40 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="w-20 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 12 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-beige shadow-sm flex-shrink-0">
        <div className="container py-6">
          <h1 className="text-4xl text-[#8b7355] mb-2">
            {areaName} Properties
          </h1>
          <p className="text-warm-gray">
            {pagination.total} properties found • Page {pagination.page} of{" "}
            {pagination.totalPages}
          </p>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mt-6">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray w-5 h-5" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 bg-white border-beige focus:border-gold rounded-xl"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              {/* Clear Search */}
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-warm-gray hover:text-gold rounded-xl"
                  onClick={() => setSearchTerm("")}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 border-[#8b7355]/30 rounded-xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container py-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold mr-3" />
            <span className="text-[#8b7355]">Loading properties...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-600 mb-4">
              Error Loading Properties
            </h3>
            <p className="text-red-500 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gold hover:bg-gold/90 text-white"
            >
              Try Again
            </Button>
          </div>
        ) : properties.length > 0 ? (
          <>
            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <Card
                  key={property.id}
                  className="group cursor-pointer border border-beige hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden rounded-xl"
                  onClick={() => router.push(`/properties/${property.id}`)}
                >
                  {/* Property Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={getImageUrl(property.cover_image_url)}
                      alt={property.name || "Property"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 right-4 bg-black/70 text-white border-0">
                      {property.sale_status || property.status || "Available"}
                    </Badge>
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
                          <Building2 className="w-4 h-4 mr-1" />
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
                          {property.sale_status ||
                            property.status ||
                            "Available"}
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    {pagination.page > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(pagination.page - 1)}
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}

                    {/* Page Numbers */}
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    )
                      .filter((page) => {
                        const current = pagination.page;
                        return (
                          page === 1 ||
                          page === pagination.totalPages ||
                          (page >= current - 1 && page <= current + 1)
                        );
                      })
                      .map((page, index, array) => {
                        const prevPage = array[index - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;

                        return (
                          <div key={page} className="flex items-center">
                            {showEllipsis && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={page === pagination.page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          </div>
                        );
                      })}

                    {pagination.page < pagination.totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(pagination.page + 1)}
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-600 mb-4">
              No Properties Found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? `No properties match "${searchTerm}" in ${areaName}.`
                : `No properties are currently available in ${areaName}.`}
            </p>
            {searchTerm && (
              <Button
                onClick={() => setSearchTerm("")}
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-white"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
