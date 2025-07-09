"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  Building2,
  MapPin,
  ArrowLeft,
  Loader2,
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  RotateCcw,
  Banknote,
  DollarSign,
  Calendar,
  Hammer,
  ShoppingCart,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Navbar } from "@/components/Navbar";

interface Property {
  id: number;
  name: string;
  area: string;
  developer: string;
  min_price?: number;
  max_price?: number;
  price_currency: string;
  cover_image_url?: string;
  sale_status: string;
  development_status: string;
  status: string;
  completion_datetime?: string;
  is_partner_project: boolean;
  featured: boolean;
  reelly_status: boolean;
}

interface Filters {
  searchTerm: string;
  priceRange: [number, number];
  priceDisplayMode: "total" | "perSqFt";
  completionTimeframe: string;
  developmentStatus: string[];
  salesStatus: string[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function DeveloperPage() {
  const params = useParams();
  const router = useRouter();
  const developerName = decodeURIComponent(params.developer as string);

  // State management
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [sortedProperties, setSortedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Dynamic filter options state
  const [developmentStatuses, setDevelopmentStatuses] = useState<string[]>([]);
  const [salesStatuses, setSalesStatuses] = useState<string[]>([]);
  const [statusesLoading, setStatusesLoading] = useState(false);
  // Applied filters (used for filtering logic)
  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    searchTerm: "",
    priceRange: [0, 20000000],
    priceDisplayMode: "total",
    completionTimeframe: "all",
    developmentStatus: [],
    salesStatus: [],
  });

  // Dialog filters (temporary state while user is selecting filters)
  const [dialogFilters, setDialogFilters] = useState<Filters>({
    searchTerm: "",
    priceRange: [0, 20000000],
    priceDisplayMode: "total",
    completionTimeframe: "all",
    developmentStatus: [],
    salesStatus: [],
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Filter helper functions for dialog filters (temporary state)
  const handleDialogFilterChange = (
    key: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    setDialogFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Filter helper functions for applied filters (search term only - immediate effect)
  const handleSearchChange = (searchTerm: string) => {
    setAppliedFilters((prev) => ({ ...prev, searchTerm }));
  };

  const resetFilters = () => {
    const defaultFilters = {
      searchTerm: "",
      priceRange: [0, 20000000] as [number, number],
      priceDisplayMode: "total" as const,
      completionTimeframe: "all",
      developmentStatus: [],
      salesStatus: [],
    };
    setDialogFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  // Count active filters (excluding search term as it's visible in the search bar)
  const getActiveFilterCount = () => {
    let count = 0;

    if (
      appliedFilters.priceRange[0] > 0 ||
      appliedFilters.priceRange[1] < 20000000
    )
      count++;
    if (appliedFilters.completionTimeframe !== "all") count++;
    if (appliedFilters.developmentStatus.length > 0) count++;
    if (appliedFilters.salesStatus.length > 0) count++;

    return count;
  };

  const handleApplyFilters = () => {
    // Apply the dialog filters to the applied filters (this will trigger the filtering)
    setAppliedFilters({ ...dialogFilters });
    setIsDialogOpen(false);
  };

  // Initialize dialog filters when dialog opens
  const handleDialogOpen = (open: boolean) => {
    if (open) {
      // Copy current applied filters to dialog filters when opening
      setDialogFilters({ ...appliedFilters });
    }
    setIsDialogOpen(open);
  };

  // Completion timeframes options
  const completionTimeframes = [
    { value: "all", label: "All Projects" },
    { value: "within_6m", label: "Within 6 months" },
    { value: "within_12m", label: "Within 12 months" },
    { value: "within_24m", label: "Within 24 months" },
    { value: "beyond_24m", label: "Beyond 24 months" },
  ];

  // Fetch statuses for filters
  const fetchStatuses = async () => {
    setStatusesLoading(true);
    try {
      const [devStatusResponse, salesStatusResponse] = await Promise.all([
        axios.get("/api/project-statuses"),
        axios.get("/api/sale-statuses"),
      ]);

      if (devStatusResponse.data.success) {
        setDevelopmentStatuses(devStatusResponse.data.data || []);
      }

      if (salesStatusResponse.data.success) {
        setSalesStatuses(salesStatusResponse.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching statuses:", error);
    } finally {
      setStatusesLoading(false);
    }
  };

  // Fetch properties by developer
  const fetchPropertiesByDeveloper = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(`🏢 Fetching properties for developer: ${developerName}`);

      const response = await axios.get(
        `/api/properties/by-developer/${encodeURIComponent(developerName)}`
      );
      const data = response.data;

      console.log("🏢 [DEVELOPER] API Response:", data);

      if (data.success && data.data) {
        const developerProperties = Array.isArray(data.data) ? data.data : [];
        console.log(
          `🏢 Found ${developerProperties.length} properties for ${developerName}`
        );
        setAllProperties(developerProperties);
        setFilteredProperties(developerProperties);
        setSortedProperties(developerProperties);
        setProperties(developerProperties.slice(0, pagination.limit));

        // Update pagination
        const newTotalPages = Math.ceil(
          developerProperties.length / pagination.limit
        );
        setPagination((prev) => ({
          ...prev,
          total: developerProperties.length,
          totalPages: newTotalPages,
        }));
      } else {
        console.log("⚠️ No properties data found in response");
        setAllProperties([]);
        setFilteredProperties([]);
        setSortedProperties([]);
        setProperties([]);
      }
    } catch (err) {
      console.error("❌ Error fetching properties by developer:", err);
      if (axios.isAxiosError(err)) {
        setError(
          `Failed to fetch properties: ${err.response?.status || err.message}`
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to fetch properties"
        );
      }
      setAllProperties([]);
      setFilteredProperties([]);
      setSortedProperties([]);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (developerName) {
      fetchPropertiesByDeveloper();
      fetchStatuses();
    }
  }, [developerName]);

  // Apply filters
  useEffect(() => {
    let result = [...allProperties];

    // Search term filter
    if (appliedFilters.searchTerm) {
      const searchLower = appliedFilters.searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.area.toLowerCase().includes(searchLower) ||
          p.developer.toLowerCase().includes(searchLower)
      );
    }

    // Price filtering - handle database structure with min_price/max_price
    // Treat null min_price as 0 for filtering
    result = result.filter((p) => {
      const minPrice = p.min_price ?? 0; // Treat null as 0
      const maxPrice = p.max_price ?? minPrice; // Use min_price if max_price is null

      return (
        minPrice >= appliedFilters.priceRange[0] &&
        maxPrice <= appliedFilters.priceRange[1]
      );
    });

    if (
      appliedFilters.completionTimeframe !== "all" &&
      appliedFilters.completionTimeframe
    ) {
      const now = new Date();
      result = result.filter((p) => {
        if (!p.completion_datetime) return false;
        const completion = new Date(p.completion_datetime);
        const monthsDiff =
          (completion.getFullYear() - now.getFullYear()) * 12 +
          completion.getMonth() -
          now.getMonth();

        switch (appliedFilters.completionTimeframe) {
          case "within_6m":
            return monthsDiff <= 6;
          case "within_12m":
            return monthsDiff <= 12;
          case "within_24m":
            return monthsDiff <= 24;
          case "beyond_24m":
            return monthsDiff > 24;
          default:
            return true;
        }
      });
    }

    if (appliedFilters.developmentStatus.length > 0) {
      result = result.filter((p) =>
        appliedFilters.developmentStatus.includes(p.development_status)
      );
    }

    if (appliedFilters.salesStatus.length > 0) {
      result = result.filter(
        (p) =>
          appliedFilters.salesStatus.includes(p.sale_status) ||
          appliedFilters.salesStatus.includes(p.status)
      );
    }

    setFilteredProperties(result);
  }, [allProperties, appliedFilters]);

  // Apply sorting
  useEffect(() => {
    let sortedResult = [...filteredProperties];

    switch (sortBy) {
      case "featured":
        // Featured: Featured properties first, then by name
        sortedResult.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.name.localeCompare(b.name);
        });
        break;

      case "price_low_high":
        // Price Low to High: Sort by min_price ascending (treat null as 0)
        sortedResult.sort((a, b) => {
          const priceA = a.min_price ?? 0;
          const priceB = b.min_price ?? 0;
          return priceA - priceB;
        });
        break;

      case "price_high_low":
        // Price High to Low: Sort by min_price descending (treat null as 0)
        sortedResult.sort((a, b) => {
          const priceA = a.min_price ?? 0;
          const priceB = b.min_price ?? 0;
          return priceB - priceA;
        });
        break;

      case "location":
        // Location: Area A-Z (alphabetical by area)
        sortedResult.sort((a, b) => {
          const areaA = a.area?.toLowerCase() || "";
          const areaB = b.area?.toLowerCase() || "";
          return areaA.localeCompare(areaB);
        });
        break;

      default:
        // No sorting
        break;
    }

    setSortedProperties(sortedResult);

    // Update pagination based on sorted results
    const newTotalPages = Math.ceil(sortedResult.length / pagination.limit);
    setPagination((prev) => ({
      ...prev,
      total: sortedResult.length,
      totalPages: newTotalPages,
      page: 1, // Reset to first page when sorting changes
    }));

    // Set properties for first page
    setProperties(sortedResult.slice(0, pagination.limit));
    setCurrentPage(1);
  }, [filteredProperties, sortBy, pagination.limit]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    const startIndex = (page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    setProperties(sortedProperties.slice(startIndex, endIndex));
    setCurrentPage(page);
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const handlePageNavigation = (page: string) => {
    router.push(`/${page}`);
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar
        onNavigate={handlePageNavigation}
        onLogoClick={handleLogoClick}
        currentPage="developers"
      />

      {/* Header */}
      {/* <div className="bg-gradient-to-br from-beige to-ivory py-16">
        <div className="container">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="mr-4 text-[#8b7355] hover:text-gold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="flex items-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mr-6">
              <Building2 className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#8b7355] mb-2">
                {developerName}
              </h1>
              <p className="text-lg text-warm-gray">
                {loading
                  ? "Loading..."
                  : `${properties.length} Properties Available`}
              </p>
            </div>
          </div>
        </div>
      </div> */}

      <header className="bg-white border-b border-beige shadow-sm flex-shrink-0">
        <div className="container py-6">
          <h1 className="text-4xl text-[#8b7355] mb-2">
            {developerName} Properties
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
                  value={appliedFilters.searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 bg-white border-beige focus:border-gold rounded-xl"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              {/* Filters */}
              <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#8b7355]/30 text-[#8b7355] hover:bg-[#8b7355] hover:text-white rounded-xl relative"
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                    {getActiveFilterCount() > 0 && (
                      <Badge className="ml-2 bg-gold text-charcoal text-xs px-1.5 py-0.5 min-w-[20px] h-5 rounded-full">
                        {getActiveFilterCount()}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] bg-white flex flex-col overflow-hidden">
                  <DialogHeader className="flex-shrink-0 pb-6 border-b border-[#F6F2ED]">
                    <div className="flex items-center justify-between">
                      <div>
                        <DialogTitle className="text-2xl text-[#8b7355]">
                          Advanced Filters
                        </DialogTitle>
                        <DialogDescription className="text-warm-gray mt-2">
                          Refine your property search using the filters below.
                        </DialogDescription>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#8b7355]/30 transition-all duration-200 text-warm-gray border-beige hover:bg-beige/50"
                          onClick={resetFilters}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                        <Button
                          className="bg-gold hover:bg-gold/90 text-charcoal"
                          onClick={handleApplyFilters}
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="flex-1 overflow-y-auto py-8 space-y-8">
                    {/* Price Configuration */}
                    <Card className="border-gold/40 bg-[#FDFCF9]">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-[#8b7355] text-xl">
                          <Banknote className="w-6 h-6 text-gold" />
                          <span>Price Configuration</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-beige/50">
                          <div className="flex items-center space-x-3">
                            <DollarSign className="w-5 h-5 text-gold" />
                            <div>
                              <Label className="text-[#8b7355] font-medium">
                                Price Display Mode
                              </Label>
                              <p className="text-xs text-warm-gray mt-1">
                                Choose how prices are displayed
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Label className="text-sm text-warm-gray">
                              Total Price
                            </Label>
                            <Switch
                              checked={
                                dialogFilters.priceDisplayMode === "perSqFt"
                              }
                              onCheckedChange={(checked) =>
                                handleDialogFilterChange(
                                  "priceDisplayMode",
                                  checked ? "perSqFt" : "total"
                                )
                              }
                            />
                            <Label className="text-sm text-warm-gray">
                              Per Sq Ft
                            </Label>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-gold" />
                            <Label className="text-[#8b7355] font-medium text-lg">
                              Price Range (AED)
                            </Label>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs text-warm-gray uppercase tracking-wide">
                                Minimum
                              </Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray text-sm">
                                  AED
                                </span>
                                <Input
                                  type="number"
                                  value={dialogFilters.priceRange[0]}
                                  onChange={(e) =>
                                    handleDialogFilterChange("priceRange", [
                                      Number(e.target.value),
                                      dialogFilters.priceRange[1],
                                    ])
                                  }
                                  className="pl-12 border-beige/50 focus:border-gold rounded-lg"
                                  placeholder="0"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-warm-gray uppercase tracking-wide">
                                Maximum
                              </Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray text-sm">
                                  AED
                                </span>
                                <Input
                                  type="number"
                                  value={dialogFilters.priceRange[1]}
                                  onChange={(e) =>
                                    handleDialogFilterChange("priceRange", [
                                      dialogFilters.priceRange[0],
                                      Number(e.target.value),
                                    ])
                                  }
                                  className="pl-12 border-beige/50 focus:border-gold rounded-lg"
                                  placeholder="10,000,000"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 p-4 bg-beige/30 rounded-lg">
                            <div className="flex justify-between text-sm text-warm-gray">
                              <span>AED 0</span>
                              <span>AED 20M</span>
                            </div>
                            <Slider
                              value={dialogFilters.priceRange}
                              onValueChange={(value) =>
                                handleDialogFilterChange(
                                  "priceRange",
                                  value as [number, number]
                                )
                              }
                              max={20000000}
                              min={0}
                              step={50000}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Project Completion */}
                    <Card className="border-beige/60">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-[#8b7355] text-lg">
                          <Clock className="w-5 h-5 text-gold" />
                          <span>Project Completion</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Label className="text-xs text-warm-gray uppercase tracking-wide">
                            Completion Timeframe
                          </Label>
                          <Select
                            value={dialogFilters.completionTimeframe}
                            onValueChange={(value) =>
                              handleDialogFilterChange(
                                "completionTimeframe",
                                value
                              )
                            }
                          >
                            <SelectTrigger className="border-beige/50 focus:border-gold rounded-lg">
                              <SelectValue placeholder="Select timeframe" />
                            </SelectTrigger>
                            <SelectContent>
                              {completionTimeframes.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Development Status */}
                      <Card className="border-beige/60 shadow-sm">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center space-x-2 text-[#8b7355] text-lg">
                            <Hammer className="w-5 h-5 text-gold" />
                            <span>Development Status</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {statusesLoading ? (
                            <div className="text-sm text-warm-gray">
                              Loading statuses...
                            </div>
                          ) : (
                            developmentStatuses.map((status: string) => (
                              <div
                                key={status}
                                className="flex items-center space-x-3"
                              >
                                <input
                                  type="checkbox"
                                  checked={dialogFilters.developmentStatus.includes(
                                    status
                                  )}
                                  onChange={(e) => {
                                    const newStatus = e.target.checked
                                      ? [
                                          ...dialogFilters.developmentStatus,
                                          status,
                                        ]
                                      : dialogFilters.developmentStatus.filter(
                                          (s: string) => s !== status
                                        );
                                    handleDialogFilterChange(
                                      "developmentStatus",
                                      newStatus
                                    );
                                  }}
                                  className="w-5 h-5 rounded-md border-2 border-[#8b7355]/30 text-gold focus:ring-gold"
                                />
                                <label className="text-sm text-warm-gray cursor-pointer flex-1">
                                  {status}
                                </label>
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>

                      {/* Sales Status */}
                      <Card className="border-beige/60 shadow-sm">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center space-x-2 text-[#8b7355] text-lg">
                            <ShoppingCart className="w-5 h-5 text-gold" />
                            <span>Sales Status</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {statusesLoading ? (
                            <div className="text-sm text-warm-gray">
                              Loading statuses...
                            </div>
                          ) : (
                            salesStatuses.map((status: string) => (
                              <div
                                key={status}
                                className="flex items-center space-x-3"
                              >
                                <input
                                  type="checkbox"
                                  checked={dialogFilters.salesStatus.includes(
                                    status
                                  )}
                                  onChange={(e) => {
                                    const newStatus = e.target.checked
                                      ? [...dialogFilters.salesStatus, status]
                                      : dialogFilters.salesStatus.filter(
                                          (s: string) => s !== status
                                        );
                                    handleDialogFilterChange(
                                      "salesStatus",
                                      newStatus
                                    );
                                  }}
                                  className="w-5 h-5 rounded-md border-2 border-[#8b7355]/30 text-gold focus:ring-gold"
                                />
                                <label className="text-sm text-warm-gray cursor-pointer flex-1">
                                  {status}
                                </label>
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Clear Filters */}
              {getActiveFilterCount() > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-warm-gray hover:text-gold rounded-xl"
                  onClick={resetFilters}
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
                  <SelectItem value="price_low_high">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price_high_low">
                    Price: High to Low
                  </SelectItem>
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
              onClick={fetchPropertiesByDeveloper}
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
                    <ImageWithFallback
                      src={getImageUrl(property.cover_image_url)}
                      alt={property.name || "Property"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 right-4 bg-black/70 text-white border-0">
                      {property.sale_status || "Available"}
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
                          {developerName || "Developer"}
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
              No properties are currently available for {developerName}.
            </p>
            <Button
              onClick={fetchPropertiesByDeveloper}
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-white"
            >
              Refresh
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
