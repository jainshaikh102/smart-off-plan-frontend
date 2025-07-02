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
  development_status: string; // Development status from complete property data
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
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [sortedProperties, setSortedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Dynamic filter options state
  const [developmentStatuses, setDevelopmentStatuses] = useState<string[]>([]);
  const [salesStatuses, setSalesStatuses] = useState<string[]>([]);
  const [statusesLoading, setStatusesLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
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

  // Filter helper functions
  const handleFilterChange = (
    key: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      priceRange: [0, 20000000],
      priceDisplayMode: "total",
      completionTimeframe: "all",
      developmentStatus: [],
      salesStatus: [],
    });
  };

  // Count active filters (excluding search term as it's visible in the search bar)
  const getActiveFilterCount = () => {
    let count = 0;

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 20000000) count++;
    if (filters.completionTimeframe !== "all") count++;
    if (filters.developmentStatus.length > 0) count++;
    if (filters.salesStatus.length > 0) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setIsDialogOpen(false);
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

  // Fetch properties from API using axios with pagination
  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/properties");
      const data = response.data;

      let fetchedProperties: Property[] = [];
      if (data.success && data.data) {
        fetchedProperties = data.data.items || data.data || [];
      } else if (Array.isArray(data)) {
        fetchedProperties = data;
      }

      setAllProperties(fetchedProperties);
      setFilteredProperties(fetchedProperties);
      setPagination({
        page: 1,
        limit: pagination.limit,
        total: fetchedProperties.length,
        totalPages: Math.ceil(fetchedProperties.length / pagination.limit),
      });

      // Set initial page properties
      setProperties(fetchedProperties.slice(0, pagination.limit));
      setCurrentPage(1);
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
      setAllProperties([]);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change with client-side slicing
  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) {
      console.warn(`⚠️ Invalid page number: ${page}`);
      return;
    }

    setCurrentPage(page);
    const startIndex = (page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    setProperties(sortedProperties.slice(startIndex, endIndex));
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Apply filters
  useEffect(() => {
    let result = [...allProperties];

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
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
        minPrice >= filters.priceRange[0] && maxPrice <= filters.priceRange[1]
      );
    });

    if (filters.completionTimeframe !== "all" && filters.completionTimeframe) {
      const now = new Date();
      result = result.filter((p) => {
        if (!p.completion_datetime) return false;
        const completion = new Date(p.completion_datetime);
        const monthsDiff =
          (completion.getFullYear() - now.getFullYear()) * 12 +
          completion.getMonth() -
          now.getMonth();

        switch (filters.completionTimeframe) {
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

    if (filters.developmentStatus.length > 0) {
      result = result.filter((p) =>
        filters.developmentStatus.includes(p.development_status)
      );
    }

    if (filters.salesStatus.length > 0) {
      result = result.filter(
        (p) =>
          filters.salesStatus.includes(p.sale_status) ||
          filters.salesStatus.includes(p.status)
      );
    }

    setFilteredProperties(result);
  }, [allProperties, filters]);

  // Apply sorting
  useEffect(() => {
    let sortedResult = [...filteredProperties];

    switch (sortBy) {
      case "featured":
        // Featured properties first, then non-featured
        sortedResult.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;

      case "price-low":
        // Price: Low to High (using min_price, treat null as 0)
        sortedResult.sort((a, b) => {
          const priceA = a.min_price ?? 0;
          const priceB = b.min_price ?? 0;
          return priceA - priceB;
        });
        break;

      case "price-high":
        // Price: High to Low (using min_price, treat null as 0)
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

  // Load properties and statuses when component mounts
  useEffect(() => {
    fetchProperties();
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
          {/* Breadcrumb */}
          {/* <div className="flex items-center space-x-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-warm-gray hover:text-gold"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <ChevronRight className="w-4 h-4 text-warm-gray" />
            <span className="text-[#8b7355]">Properties</span>
            {selectedDeveloper && (
              <>
                <ChevronRight className="w-4 h-4 text-warm-gray" />
                <span className="text-gold">{selectedDeveloper.name}</span>
              </>
            )}
          </div> */}

          {/* Title */}
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
                  value={filters.searchTerm}
                  onChange={(e) =>
                    handleFilterChange("searchTerm", e.target.value)
                  }
                  className="pl-10 bg-white border-beige focus:border-gold rounded-xl"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              {/* Filters */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                              checked={filters.priceDisplayMode === "perSqFt"}
                              onCheckedChange={(checked) =>
                                handleFilterChange(
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
                                  value={filters.priceRange[0]}
                                  onChange={(e) =>
                                    handleFilterChange("priceRange", [
                                      Number(e.target.value),
                                      filters.priceRange[1],
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
                                  value={filters.priceRange[1]}
                                  onChange={(e) =>
                                    handleFilterChange("priceRange", [
                                      filters.priceRange[0],
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
                              value={filters.priceRange}
                              onValueChange={(value) =>
                                handleFilterChange(
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
                            value={filters.completionTimeframe}
                            onValueChange={(value) =>
                              handleFilterChange("completionTimeframe", value)
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
                                  checked={filters.developmentStatus.includes(
                                    status
                                  )}
                                  onChange={(e) => {
                                    const newStatus = e.target.checked
                                      ? [...filters.developmentStatus, status]
                                      : filters.developmentStatus.filter(
                                          (s) => s !== status
                                        );
                                    handleFilterChange(
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
                                  checked={filters.salesStatus.includes(status)}
                                  onChange={(e) => {
                                    const newStatus = e.target.checked
                                      ? [...filters.salesStatus, status]
                                      : filters.salesStatus.filter(
                                          (s) => s !== status
                                        );
                                    handleFilterChange(
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
              {pagination.page > 1 ? ` for page ${pagination.page}` : ""}...
            </div>
            <div className="mt-2 text-sm text-warm-gray/70">
              {pagination.page > 1 &&
                `Fetching page ${pagination.page} of ${pagination.totalPages}`}
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
                  <Badge className="absolute top-4 right-4 bg-black/70 text-white border-0">
                    {property.status || "Available"}
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
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((pageNum) => {
                    // Show first page, last page, current page, and pages around current page
                    const showPage =
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      Math.abs(pageNum - pagination.page) <= 1;

                    if (!showPage) {
                      // Show ellipsis for gaps
                      if (pageNum === 2 && pagination.page > 4) {
                        return (
                          <PaginationItem key={`ellipsis-start`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      if (
                        pageNum === pagination.totalPages - 1 &&
                        pagination.page < pagination.totalPages - 3
                      ) {
                        return (
                          <PaginationItem key={`ellipsis-end`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => {
                            handlePageChange(pageNum);
                          }}
                          isActive={pageNum === pagination.page}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

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
