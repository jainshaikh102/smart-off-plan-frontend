import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "./ui/pagination";
import {
  Home,
  ChevronRight,
  MapPin,
  Search,
  Grid3X3,
  List,
  Building2,
  SlidersHorizontal,
  RotateCcw,
  DollarSign,
  Ruler,
  Clock,
  Hammer,
  ShoppingCart,
  TrendingUp,
  Banknote,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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

interface Filters {
  searchTerm: string;
  priceRange: [number, number];
  priceDisplayMode: "total" | "perSqFt";
  areaRange: [number, number];
  completionTimeframe: string;
  developmentStatus: string[];
  salesStatus: string[];
  unitType: string[];
  bedrooms: string[];
  featured: boolean | null; // null = no filter, true = only featured, false = only non-featured
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
  // State management
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Helper functions for localStorage
  const saveFiltersToStorage = (filters: Filters) => {
    // Check if we're in the browser environment
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.setItem(
        "allPropertiesFilters",
        JSON.stringify({
          ...filters,
          timestamp: Date.now(),
        })
      );
      console.log("✅ Filters saved to localStorage");
    } catch (error) {
      console.warn("⚠️ Failed to save filters to localStorage:", error);
    }
  };

  const loadFiltersFromStorage = (): Filters | null => {
    // Check if we're in the browser environment
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const saved = localStorage.getItem("allPropertiesFilters");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if filters are less than 24 hours old
        const isRecent =
          parsed.timestamp &&
          Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000;
        if (isRecent) {
          const { timestamp, ...filters } = parsed;
          console.log("✅ Loaded saved filters from localStorage");
          return filters;
        } else {
          // Remove expired filters
          localStorage.removeItem("allPropertiesFilters");
          console.log("🗑️ Removed expired filters from localStorage");
        }
      }
    } catch (error) {
      console.warn("⚠️ Failed to load filters from localStorage:", error);
      if (typeof window !== "undefined") {
        localStorage.removeItem("allPropertiesFilters");
      }
    }
    return null;
  };

  // Dynamic filter options state
  const [developmentStatuses, setDevelopmentStatuses] = useState<string[]>([]);
  const [unitType, setUnitType] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState<string[]>([]);
  const [salesStatuses, setSalesStatuses] = useState<string[]>([]);
  const [statusesLoading, setStatusesLoading] = useState(false);
  // Applied filters (used for API calls) - initialize with defaults, load from storage in useEffect
  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    searchTerm: "",
    priceRange: [0, 20000000],
    priceDisplayMode: "total",
    areaRange: [0, 50000], // sqft
    completionTimeframe: "all",
    developmentStatus: [],
    salesStatus: [],
    unitType: [],
    bedrooms: [],
    featured: null, // No featured filter by default
  });

  // Dialog filters (temporary state while user is selecting filters) - initialize with applied filters
  const [dialogFilters, setDialogFilters] = useState<Filters>(appliedFilters);

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
    setAppliedFilters((prev) => {
      const newFilters = { ...prev, searchTerm };
      // Save filters to localStorage for persistence
      saveFiltersToStorage(newFilters);
      return newFilters;
    });
  };

  const resetFilters = () => {
    const defaultFilters = {
      searchTerm: "",
      priceRange: [0, 20000000] as [number, number],
      priceDisplayMode: "total" as const,
      areaRange: [0, 50000] as [number, number],
      completionTimeframe: "all",
      developmentStatus: [],
      salesStatus: [],
      unitType: [],
      bedrooms: [],
      featured: null as boolean | null,
    };
    setDialogFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    // Clear saved filters from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("allPropertiesFilters");
      console.log("🗑️ Cleared saved filters from localStorage");
    }
  };

  // Count active filters (excluding search term as it's visible in the search bar)
  const getActiveFilterCount = () => {
    let count = 0;

    if (
      appliedFilters.priceRange[0] > 0 ||
      appliedFilters.priceRange[1] < 20000000
    )
      count++;
    if (appliedFilters.areaRange[0] > 0 || appliedFilters.areaRange[1] < 50000)
      count++;
    if (appliedFilters.completionTimeframe !== "all") count++;
    if (appliedFilters.developmentStatus.length > 0) count++;
    if (appliedFilters.salesStatus.length > 0) count++;
    if (appliedFilters.unitType.length > 0) count++;
    if (appliedFilters.bedrooms.length > 0) count++;
    if (appliedFilters.featured !== null) count++;

    return count;
  };

  const handleApplyFilters = () => {
    // Apply the dialog filters to the applied filters (this will trigger the API call)
    const newFilters = { ...dialogFilters };
    setAppliedFilters(newFilters);
    // Save filters to localStorage for persistence
    saveFiltersToStorage(newFilters);
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

  // Fetch development and sales statuses from API
  const fetchStatuses = async () => {
    setStatusesLoading(true);
    try {
      // Fetch development statuses
      const devResponse = await axios.get("/api/project-statuses");
      if (devResponse.data.success && devResponse.data.data) {
        const statuses = devResponse.data.data.map(
          (item: any) => item.name || item
        );
        setDevelopmentStatuses(statuses);
      }

      // Fetch sales statuses
      const salesResponse = await axios.get("/api/sale-statuses");
      if (salesResponse.data.success && salesResponse.data.data) {
        const statuses = salesResponse.data.data.map(
          (item: any) => item.name || item
        );
        setSalesStatuses(statuses);
      }

      // Use consolidated unit types (8 main categories only)
      setUnitType([
        "Apartments",
        "Villa",
        "Townhouse",
        "Duplex",
        "Penthouse",
        "Loft",
        "Mansion",
        "Other",
      ]);
      console.log("✅ Using consolidated unit types (8 categories)");

      // Use consolidated bedroom options (6 main categories only)
      setBedrooms(["Studio", "Suite", "1 BR", "2 BR", "3 BR", "4 BR", "5+ BR"]);
      console.log("✅ Using consolidated bedroom options (6 categories)");
    } catch (error) {
      console.error("❌ Error fetching statuses:", error);
      // Fallback to hardcoded values
      setDevelopmentStatuses(["Completed", "Under construction", "Presale"]);
      setSalesStatuses([
        "Presale(EOI)",
        "On sale",
        "Out of stock",
        "Announced",
        "Start of sales",
      ]);
      // Use consolidated fallback values (8 unit types, 6 bedroom categories)
      setUnitType([
        "Apartments",
        "Villa",
        "Townhouse",
        "Duplex",
        "Penthouse",
        "Loft",
        "Mansion",
        "Other",
      ]);
      setBedrooms(["Studio", "Suite", "1 BR", "2 BR", "3 BR", "4 BR", "5+ BR"]);
    } finally {
      setStatusesLoading(false);
    }
  };

  const completionTimeframes = [
    { value: "all", label: "All Projects" },
    { value: "within_6m", label: "Within 6 Months" },
    { value: "within_12m", label: "Within 12 Months" },
    { value: "within_24m", label: "Within 24 Months" },
    { value: "beyond_24m", label: "Beyond 24 Months" },
  ];

  // Fetch properties from API with server-side pagination
  const fetchProperties = async (page: number = 1, limit: number = 12) => {
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

      const response = await axios.get(`/api/properties?${params.toString()}`);
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
          setCurrentPage(data.pagination.page);
        }
        console.log(
          `✅ Fetched ${fetchedProperties.length} properties (page ${page}/${
            data.pagination?.totalPages || 1
          })`
        );
        console.log("📊 Pagination info:", data.pagination);
        console.log(
          "🔍 API URL called:",
          `/api/properties?${params.toString()}`
        );
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
      setLoading(false);
    }
  };

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
    // Reset to page 1 when applied filters change and fetch new data
    fetchProperties(1, pagination.limit);
  }, [appliedFilters, sortBy]); // Re-fetch when applied filters or sorting changes

  // Load saved filters from localStorage after component mounts (client-side only)
  useEffect(() => {
    const savedFilters = loadFiltersFromStorage();
    if (savedFilters) {
      setAppliedFilters(savedFilters);
      setDialogFilters(savedFilters);
      console.log("🔄 Restored saved filters from localStorage");
    } else {
      // Sync dialogFilters with default appliedFilters
      setDialogFilters(appliedFilters);
    }
  }, []); // Only run once on mount

  // Load properties and statuses when component mounts
  useEffect(() => {
    console.log("🚀 AllPropertiesPage: Initial load - fetching first page");
    fetchProperties(1, 12); // Explicitly pass page 1 and limit 12
    fetchStatuses();
  }, []);

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
                          <span> Price Range (AED)</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
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
                                  value={
                                    dialogFilters.priceRange[0] === 0
                                      ? ""
                                      : dialogFilters.priceRange[0]
                                  }
                                  onChange={(e) =>
                                    handleDialogFilterChange("priceRange", [
                                      Number(e.target.value) || 0,
                                      dialogFilters.priceRange[1],
                                    ])
                                  }
                                  onFocus={(e) => {
                                    if (dialogFilters.priceRange[0] === 0) {
                                      e.target.select();
                                    }
                                  }}
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
                                  value={
                                    dialogFilters.priceRange[1] === 20000000
                                      ? ""
                                      : dialogFilters.priceRange[1]
                                  }
                                  onChange={(e) =>
                                    handleDialogFilterChange("priceRange", [
                                      dialogFilters.priceRange[0],
                                      Number(e.target.value) || 20000000,
                                    ])
                                  }
                                  onFocus={(e) => {
                                    if (
                                      dialogFilters.priceRange[1] === 20000000
                                    ) {
                                      e.target.select();
                                    }
                                  }}
                                  className="pl-12 border-beige/50 focus:border-gold rounded-lg"
                                  placeholder="20,000,000"
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Area Range */}
                      <Card className="border-beige/60">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-[#8b7355] text-lg">
                            <Home className="w-5 h-5 text-gold" />
                            <span>Area Range</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* <div className="flex items-center space-x-2">
                              <Home className="w-5 h-5 text-gold" />
                              <Label className="text-[#8b7355] font-medium text-lg">
                                Area Range (sqm)
                              </Label>
                            </div> */}

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs text-warm-gray uppercase tracking-wide">
                                  Min Area
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray text-sm">
                                    sqft
                                  </span>
                                  <Input
                                    type="number"
                                    value={
                                      dialogFilters.areaRange[0] === 0
                                        ? ""
                                        : dialogFilters.areaRange[0]
                                    }
                                    onChange={(e) =>
                                      handleDialogFilterChange("areaRange", [
                                        Number(e.target.value) || 0,
                                        dialogFilters.areaRange[1],
                                      ])
                                    }
                                    onFocus={(e) => {
                                      if (dialogFilters.areaRange[0] === 0) {
                                        e.target.select();
                                      }
                                    }}
                                    className="pl-12 border-beige/50 focus:border-gold rounded-lg"
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs text-warm-gray uppercase tracking-wide">
                                  Max Area
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray text-sm">
                                    sqft
                                  </span>
                                  <Input
                                    type="number"
                                    value={
                                      dialogFilters.areaRange[1] === 50000
                                        ? ""
                                        : dialogFilters.areaRange[1]
                                    }
                                    onChange={(e) =>
                                      handleDialogFilterChange("areaRange", [
                                        dialogFilters.areaRange[0],
                                        Number(e.target.value) || 50000,
                                      ])
                                    }
                                    onFocus={(e) => {
                                      if (
                                        dialogFilters.areaRange[1] === 50000
                                      ) {
                                        e.target.select();
                                      }
                                    }}
                                    className="pl-12 border-beige/50 focus:border-gold rounded-lg"
                                    placeholder="50,000"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm text-warm-gray">
                                <span>0 sqft</span>
                                <span>50,000 sqft</span>
                              </div>
                              <Slider
                                value={dialogFilters.areaRange}
                                onValueChange={(value) =>
                                  handleDialogFilterChange(
                                    "areaRange",
                                    value as [number, number]
                                  )
                                }
                                max={50000}
                                min={0}
                                step={50}
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
                    </div>

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

                      {/* Unit Type  */}
                      <Card className="border-beige/60 shadow-sm">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center space-x-2 text-[#8b7355] text-lg">
                            <Hammer className="w-5 h-5 text-gold" />
                            <span>Unit Type</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {statusesLoading ? (
                            <div className="text-sm text-warm-gray">
                              Loading statuses...
                            </div>
                          ) : (
                            unitType.map((type: string) => (
                              <div
                                key={type}
                                className="flex items-center space-x-3"
                              >
                                <input
                                  type="checkbox"
                                  checked={dialogFilters.unitType.includes(
                                    type
                                  )}
                                  onChange={(e) => {
                                    const newUnitType = e.target.checked
                                      ? [...dialogFilters.unitType, type]
                                      : dialogFilters.unitType.filter(
                                          (t: string) => t !== type
                                        );
                                    handleDialogFilterChange(
                                      "unitType",
                                      newUnitType
                                    ); // Update unitType
                                  }}
                                  className="w-5 h-5 rounded-md border-2 border-[#8b7355]/30 text-gold focus:ring-gold"
                                />
                                <label className="text-sm text-warm-gray cursor-pointer flex-1">
                                  {type}
                                </label>
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>

                      {/* Bedrooms */}
                      <Card className="border-beige/60 shadow-sm">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center space-x-2 text-[#8b7355] text-lg">
                            <Hammer className="w-5 h-5 text-gold" />
                            <span>Bedrooms</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {statusesLoading ? (
                            <div className="text-sm text-warm-gray">
                              Loading statuses...
                            </div>
                          ) : (
                            bedrooms.map((type: string) => (
                              <div
                                key={type}
                                className="flex items-center space-x-3"
                              >
                                <input
                                  type="checkbox"
                                  checked={dialogFilters.bedrooms.includes(
                                    type
                                  )}
                                  onChange={(e) => {
                                    const newBedrooms = e.target.checked
                                      ? [...dialogFilters.bedrooms, type]
                                      : dialogFilters.bedrooms.filter(
                                          (t: string) => t !== type
                                        );
                                    handleDialogFilterChange(
                                      "bedrooms",
                                      newBedrooms
                                    );
                                  }}
                                  className="w-5 h-5 rounded-md border-2 border-[#8b7355]/30 text-gold focus:ring-gold"
                                />
                                <label className="text-sm text-warm-gray cursor-pointer flex-1">
                                  {type}
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
