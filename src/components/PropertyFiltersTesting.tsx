import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  MapPin,
  Search,
  SlidersHorizontal,
  RotateCcw,
  TrendingUp,
  Clock,
  ShoppingCart,
  Banknote,
  Hammer,
  Building,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useRouter } from "next/navigation";

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

interface PropertyFiltersTestingProps {
  onPropertySelect: (property: Property) => void;
}

export function PropertyFiltersTesting({
  onPropertySelect,
}: PropertyFiltersTestingProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Infinite scroll pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProperties, setTotalProperties] = useState(0);

  const mapRef = useRef<L.Map | null>(null);

  // Applied filters (used for API calls)
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

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  // Dynamic filter options state
  const [developmentStatuses, setDevelopmentStatuses] = useState<string[]>([]);
  const [salesStatuses, setSalesStatuses] = useState<string[]>([]);
  const [statusesLoading, setStatusesLoading] = useState(false);
  const router = useRouter();

  // Ref for infinite scroll trigger
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchProperties = async (
    page: number = 1,
    limit: number = 12,
    append: boolean = false
  ) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
    }

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
          default:
            backendSortValue = "featured"; // Default to featured
        }
        params.append("sort", backendSortValue);
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
      if (appliedFilters.developmentStatus.length > 0) {
        params.append(
          "development_status",
          appliedFilters.developmentStatus.join(",")
        );
      }
      if (appliedFilters.salesStatus.length > 0) {
        params.append("sale_status", appliedFilters.salesStatus.join(","));
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

        // Update properties - append for infinite scroll or replace for new search
        if (append) {
          setProperties((prev) => [...prev, ...fetchedProperties]);
        } else {
          setProperties(fetchedProperties);
        }

        // Update pagination info from server response
        if (data.pagination) {
          setCurrentPage(data.pagination.page);
          setTotalProperties(data.pagination.total);
          setHasMore(data.pagination.page < data.pagination.totalPages);
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
        if (!append) {
          setProperties([]);
          setCurrentPage(1);
          setTotalProperties(0);
          setHasMore(false);
        }
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
      if (!append) {
        setProperties([]);
        setCurrentPage(1);
        setTotalProperties(0);
        setHasMore(false);
      }
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
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

  // Load more properties for infinite scroll
  const loadMoreProperties = () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      fetchProperties(nextPage, 12, true);
    }
  };

  useEffect(() => {
    console.log(
      "🚀 PropertyFiltersTesting: Initial load - fetching first page"
    );
    fetchProperties(1, 12);
    fetchStatuses();
  }, []);

  // Apply filters and sorting - trigger new API call with server-side filtering
  useEffect(() => {
    // Reset pagination and fetch new data when filters change
    setCurrentPage(1);
    setHasMore(true);
    fetchProperties(1, 12, false);
  }, [appliedFilters, sortBy]); // Re-fetch when applied filters or sorting changes

  // Infinite scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loadingMore && !loading) {
          loadMoreProperties();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loadingMore, loading]);

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

  const handleApplyFilters = () => {
    // Apply the dialog filters to the applied filters (this will trigger the API call)
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

  // Handle property hover from list - zoom to property and show popup
  const handlePropertyListHover = (property: Property) => {
    setHoveredProperty(property);
    if (mapRef.current) {
      // Parse coordinates from the property
      const coords = parseCoordinates(property.coordinates);
      if (coords) {
        // Zoom to property location
        const map = mapRef.current;
        map.setView([coords.lat, coords.lng], 16, {
          animate: true,
          duration: 0.8,
        });
        // Show popup for this property
        setSelectedProperty(property);
      }
    }
  };

  // Handle property hover end from list - just clear hover state, keep map position
  const handlePropertyListHoverEnd = () => {
    setHoveredProperty(null);
    // Remove popup but keep map position where user is
    setSelectedProperty(null);
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

  // Parse coordinates from database structure to { lat, lng }
  const parseCoordinates = (
    coordinates: string | { lat: number; lng: number } | undefined
  ): { lat: number; lng: number } => {
    try {
      if (!coordinates) {
        throw new Error("No coordinates provided");
      }

      // If coordinates is already an object
      if (
        typeof coordinates === "object" &&
        coordinates.lat &&
        coordinates.lng
      ) {
        return { lat: coordinates.lat, lng: coordinates.lng };
      }

      // If coordinates is a string, try to parse it
      if (typeof coordinates === "string") {
        const [lat, lng] = coordinates
          .split(",")
          .map((s) => parseFloat(s.trim()));
        if (isNaN(lat) || isNaN(lng)) {
          throw new Error("Invalid coordinates");
        }
        return { lat, lng };
      }

      throw new Error("Invalid coordinate format");
    } catch {
      return { lat: 25.2048, lng: 55.2708 }; // Fallback to Dubai center
    }
  };

  // Calculate initial map view based on properties
  const initialViewState = {
    latitude: 25.2048,
    longitude: 55.2708,
    zoom: 10,
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

  // MapEvents component for handling map interactions
  function MapEvents() {
    useMapEvents({
      click: () => {
        setSelectedProperty(null);
      },
    });
    return null;
  }

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-[#8b7355] mb-6">Find Your Perfect Property</h2>
          <p className="text-warm-gray max-w-2xl mx-auto text-lg">
            Explore our curated selection of luxury properties in Dubai's most
            prestigious locations. Use our advanced search and interactive map
            to find your ideal investment.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-8 lg:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-warm-gray w-5 h-5" />
              <input
                type="text"
                placeholder="Search by property name or location..."
                value={appliedFilters.searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full h-12 pl-12 pr-4 border border-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold bg-white text-[#8b7355]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
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
              <DialogContent className="sm:max-w-6xl max-h-[90vh] bg-white flex flex-col overflow-hidden">
                <DialogHeader className="flex-shrink-0 pb-6 border-b border-[#F6F2ED]">
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-2xl text-[#8b7355]">
                        Advanced Filters
                      </DialogTitle>
                      <DialogDescription className="text-warm-gray mt-2">
                        Refine your property search using the filters below to
                        find properties that match your specific requirements.
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
                  <Card className="border-gold/40 bg-[#FDFCF9]">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-[#8b7355] text-xl">
                        <TrendingUp className="w-5 h-5 text-gold" />
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

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                            Completion Period
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

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

            <Button
              variant="ghost"
              className="text-warm-gray hover:text-gold rounded-xl"
              onClick={resetFilters}
            >
              {/* <X className="w-4 h-4 mr-2" /> */}
              Clear
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-[#8b7355]">
              {totalProperties} properties found • Showing {properties.length}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort By */}
            <div className="flex items-center space-x-2">
              <Label className="text-sm text-[#8b7355]">Sort by:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-beige/50 focus:border-gold rounded-lg">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1">
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-warm-gray mb-4">
                    Loading properties...
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-warm-gray mb-4">{error}</div>
                  <Button
                    onClick={() => fetchProperties(1, 12)}
                    className="bg-gold hover:bg-gold/90 text-charcoal"
                  >
                    Retry
                  </Button>
                </div>
              ) : properties.length > 0 ? (
                properties.map((property) => (
                  <div
                    key={property.id}
                    className={`border rounded-lg p-3 transition-all duration-300 cursor-pointer border-[#F6F2ED] hover:border-[#D4A373]/50 hover:shadow-md ${
                      hoveredProperty?.id === property.id
                        ? "border-gold shadow-lg bg-gold/5"
                        : ""
                    }`}
                    onClick={() => router.push(`/properties/${property.id}`)}
                    onMouseEnter={() => handlePropertyListHover(property)}
                    onMouseLeave={handlePropertyListHoverEnd}
                  >
                    <div className="flex gap-3">
                      <ImageWithFallback
                        src={getImageUrl(property.cover_image_url)}
                        alt={property.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="mb-1 truncate text-sm text-[rgba(30,26,26,1)]">
                          {property.name}
                        </h4>
                        <div className="flex items-center text-muted-foreground text-xs mb-1">
                          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{property.area}</span>
                        </div>
                        <div className="text-deep-blue mb-2 text-sm">
                          {property.min_price && property.max_price
                            ? `${property.price_currency} ${(
                                property.min_price / 1000000
                              ).toFixed(1)}M - ${(
                                property.max_price / 1000000
                              ).toFixed(1)}M`
                            : property.min_price
                            ? `${property.price_currency} ${(
                                property.min_price / 1000000
                              ).toFixed(1)}M+`
                            : "Price on Request"}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Building className="w-3 h-3 mr-1" />
                            {property.developer}
                          </div>
                        </div>

                        <Badge
                          className={`mt-2 text-xs tracking-wide ${
                            property.development_status === "Completed"
                              ? "bg-[#8b7355] text-white"
                              : property.development_status ===
                                "Under construction"
                              ? "bg-[#FF6900] text-white"
                              : property.development_status === "Presale"
                              ? "bg-[#D4AF37] text-white"
                              : "" // Fallback for unexpected values
                          }`}
                        >
                          {property.development_status ||
                            property.development_status ||
                            "Available"}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-gold p-1"
                      >
                        {/* <Heart className="w-4 h-4" /> */}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-warm-gray mb-4">
                    No properties found matching your criteria
                  </div>
                  <Button
                    onClick={resetFilters}
                    className="bg-gold hover:bg-gold/90 text-charcoal"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}

              {/* Infinite scroll trigger and loading indicator */}
              {properties.length > 0 && (
                <div className="mt-6">
                  {/* Intersection observer trigger */}
                  <div ref={loadMoreRef} className="h-4" />

                  {/* Loading more indicator */}
                  {loadingMore && (
                    <div className="text-center py-4">
                      <div className="text-warm-gray text-sm">
                        Loading more properties...
                      </div>
                    </div>
                  )}

                  {/* End of results indicator */}
                  {!hasMore && !loadingMore && properties.length > 0 && (
                    <div className="text-center py-4">
                      <div className="text-warm-gray text-sm">
                        You've reached the end of the results
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-[600px] border-beige shadow-sm overflow-hidden">
              <CardContent className="p-0 h-full relative">
                <MapContainer
                  className="custom-map"
                  center={[
                    initialViewState.latitude,
                    initialViewState.longitude,
                  ]}
                  zoom={initialViewState.zoom}
                  style={{ height: "100%", width: "100%" }}
                  zoomControl={false}
                  ref={mapRef}
                >
                  <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <ZoomControl position="topright" />

                  {properties
                    .filter((property) => property.coordinates)
                    .map((property) => {
                      const coords = parseCoordinates(property.coordinates);
                      const isHovered = hoveredProperty?.id === property.id;

                      return (
                        <Marker
                          key={property.id}
                          position={[coords.lat, coords.lng]}
                          icon={createCustomIcon(isHovered)} // Use custom icon
                          eventHandlers={{
                            click: () => {
                              setSelectedProperty(property);
                              // Don't interfere with list hover - only handle clicks
                            },
                          }}
                        >
                          {(selectedProperty?.id === property.id ||
                            isHovered) && (
                            <Popup>
                              <div className="flex gap-3">
                                <ImageWithFallback
                                  src={getImageUrl(property.cover_image_url)}
                                  alt={property.name}
                                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                />

                                <div className="flex-1 min-w-0">
                                  <h4 className="mb-1 truncate text-sm text-[#D4AF37]">
                                    {property.name}
                                  </h4>
                                  <div className="flex items-center text-muted-foreground text-xs mb-1">
                                    <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                    <span className="truncate">
                                      {property.area}
                                    </span>
                                  </div>
                                  <div className="mb-2 text-sm text-[#D4AF37]">
                                    {property.min_price && property.max_price
                                      ? `${property.price_currency} ${(
                                          property.min_price / 1000000
                                        ).toFixed(1)}M - ${(
                                          property.max_price / 1000000
                                        ).toFixed(1)}M`
                                      : property.min_price
                                      ? `${property.price_currency} ${(
                                          property.min_price / 1000000
                                        ).toFixed(1)}M+`
                                      : "Price on Request"}
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <div className="flex items-center">
                                      <Building className="w-3 h-3 mr-1" />
                                      {property.developer}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Popup>
                          )}
                        </Marker>
                      );
                    })}
                  <MapEvents />
                </MapContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-[#FAF8F4] rounded-2xl p-8">
            <h3 className="text-[#8b7355] mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-warm-gray mb-6 max-w-2xl mx-auto">
              Our expert team has access to exclusive off-market properties and
              upcoming launches. Let us help you find your perfect investment
              opportunity.
            </p>
            <Button className="bg-gold hover:bg-gold/90 text-charcoal px-8 py-3">
              Speak with an Expert
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const createCustomIcon = (isHovered = false) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
          <div style="
            position: relative;
            width: ${isHovered ? "48px" : "32px"};
            height: ${isHovered ? "48px" : "32px"};
            background: #FFD700;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 300ms ease;
            ${
              isHovered
                ? "transform: scale(1.1); box-shadow: 0 25px 50px -12px rgba(255, 215, 0, 0.5);"
                : ""
            }
          " class="marker-inner ${isHovered ? "hovered" : ""}">
            <div style="
              width: ${isHovered ? "16px" : "12px"};
              height: ${isHovered ? "16px" : "12px"};
              background: white;
              border-radius: 50%;
              transition: all 300ms ease;
            "></div>
            ${
              isHovered
                ? `
              <div style="
                position: absolute;
                inset: 0;
                border-radius: 50%;
                background: #FFD700;
                opacity: 0.3;
                animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
              <div style="
                position: absolute;
                inset: 0;
                border-radius: 50%;
                background: rgba(255, 215, 0, 0.2);
                transform: scale(1.5);
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
              "></div>
            `
                : ""
            }
          </div>
          <style>
            @keyframes ping {
              75%, 100% {
                transform: scale(2);
                opacity: 0;
              }
            }
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
            }
          </style>
        `,
    iconSize: [isHovered ? 48 : 32, isHovered ? 48 : 32], // Match width/height
    iconAnchor: [isHovered ? 24 : 16, isHovered ? 24 : 16], // Center of circle
    popupAnchor: [0, isHovered ? -24 : -16], // Popup above marker
  });
};
