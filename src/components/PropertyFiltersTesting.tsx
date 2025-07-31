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

// Add custom styles for English-only map labels
const mapStyles = `
  .english-map {
    font-family: 'Arial', 'Helvetica', sans-serif !important;
  }
  .english-map .leaflet-container {
    font-family: 'Arial', 'Helvetica', sans-serif !important;
  }
  .leaflet-container {
    direction: ltr !important;
  }
`;
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
  const [properties, setProperties] = useState<Property[]>([]); // For property list (paginated)
  const [mapProperties, setMapProperties] = useState<Property[]>([]); // For map markers (all properties)
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
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
  const [currentZoom, setCurrentZoom] = useState(10);
  // Dynamic filter options state
  const [developmentStatuses, setDevelopmentStatuses] = useState<string[]>([]);
  const [salesStatuses, setSalesStatuses] = useState<string[]>([]);
  const [statusesLoading, setStatusesLoading] = useState(false);
  const router = useRouter();

  // Ref for infinite scroll trigger
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch all properties for map markers (no pagination)
  const fetchMapProperties = async () => {
    setMapLoading(true);
    try {
      console.log("🗺️ Fetching all properties for map markers...");

      const params = new URLSearchParams();

      // Apply same filters as the property list
      if (appliedFilters.searchTerm) {
        params.append("search", appliedFilters.searchTerm);
      }

      if (appliedFilters.priceRange[0] > 0) {
        params.append("min_price", appliedFilters.priceRange[0].toString());
      }
      if (appliedFilters.priceRange[1] < 50000000) {
        params.append("max_price", appliedFilters.priceRange[1].toString());
      }

      if (appliedFilters.developmentStatus.length > 0) {
        appliedFilters.developmentStatus.forEach((status) => {
          params.append("development_status", status);
        });
      }

      if (appliedFilters.salesStatus.length > 0) {
        appliedFilters.salesStatus.forEach((status) => {
          params.append("sale_status", status);
        });
      }

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

      // Add sorting
      if (sortBy && sortBy !== "featured") {
        params.append("sort", sortBy);
      }

      const response = await axios.get(
        `/api/properties/all?${params.toString()}`
      );
      const data = response.data;

      if (data.success && data.data) {
        setMapProperties(data.data || []);
        console.log(`✅ Fetched ${data.data.length} properties for map`);
      } else {
        setMapProperties([]);
      }
    } catch (err) {
      console.error("❌ Error fetching map properties:", err);
      setMapProperties([]);
    } finally {
      setMapLoading(false);
    }
  };

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
      "🚀 PropertyFiltersTesting: Initial load - fetching first page and map properties"
    );
    fetchProperties(1, 12);
    fetchMapProperties(); // Fetch all properties for map
    fetchStatuses();
  }, []);

  // Apply filters and sorting - trigger new API call with server-side filtering
  useEffect(() => {
    // Reset pagination and fetch new data when filters change
    setCurrentPage(1);
    setHasMore(true);
    fetchProperties(1, 12, false);
    fetchMapProperties(); // Also update map properties when filters change
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

  // Handle property hover from list - move to property but maintain zoom level 12
  const handlePropertyListHover = (property: Property) => {
    setHoveredProperty(property);
    if (mapRef.current) {
      // Parse coordinates from the property
      const coords = parseCoordinates(property.coordinates);
      if (coords) {
        // Move to property location but keep zoom at 12
        const map = mapRef.current;
        map.setView([coords.lat, coords.lng], 12, {
          animate: true,
          duration: 0.8,
        });
        // Show popup for this property - find it in mapProperties for consistency
        const mapProperty = mapProperties.find((p) => p.id === property.id);
        setSelectedProperty(mapProperty || property);
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
      zoomend: (e) => {
        setCurrentZoom(e.target.getZoom());
      },
    });
    return null;
  }

  return (
    <section className="section-padding bg-white">
      <style dangerouslySetInnerHTML={{ __html: mapStyles }} />
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
                    onClick={() =>
                      router.push(`/properties/${property.externalId}`)
                    }
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
                {/* Zoom Level Display */}
                <div className="absolute top-4 left-4 z-[1000] bg-white px-3 py-2 rounded-lg shadow-lg border">
                  <div className="text-sm font-medium text-gray-700">
                    Zoom: {currentZoom.toFixed(1)}
                  </div>
                </div>

                {/* Map Loading Indicator */}
                {mapLoading && (
                  <div className="absolute top-4 right-4 z-[1000] bg-white px-3 py-2 rounded-lg shadow-lg border">
                    <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                      Loading map...
                    </div>
                  </div>
                )}

                <MapContainer
                  className="custom-map english-map"
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
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />
                  <ZoomControl position="topright" />

                  {mapProperties
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
            <Button
              className="bg-gold hover:bg-gold/90 text-charcoal px-8 py-3"
              onClick={() => router.push(`/contact`)}
            >
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
