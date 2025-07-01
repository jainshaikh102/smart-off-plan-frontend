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

// Fix for default markers in react-leaflet
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

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
import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import {
  MapPin,
  Search,
  ZoomIn,
  ZoomOut,
  Layers,
  Maximize2,
  Heart,
  Bed,
  Bath,
  Square,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  DollarSign,
  Ruler,
  Building,
  Home,
  Calendar,
  TrendingUp,
  Clock,
  ShoppingCart,
  Banknote,
  Check,
  Hammer,
  Home as HomeIcon,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";

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

interface Region {
  name: string;
  bbox_ne_lat: number;
  bbox_ne_lng: number;
  bbox_sw_lat: number;
  bbox_sw_lng: number;
}

interface Filters {
  searchTerm: string;
  priceRange: [number, number];
  priceDisplayMode: "total" | "perSqFt";
  areaRange: [number, number];
  completionTimeframe: string;
  developmentStatus: string[];
  unitType: string[];
  bedrooms: number[];
  salesStatus: string[];
}

interface PropertyFiltersTestingProps {
  onPropertySelect: (property: Property) => void;
}

export function PropertyFiltersTesting({
  onPropertySelect,
}: PropertyFiltersTestingProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<number | null>(
    null
  );
  const [mapHoveredPropertyId, setMapHoveredPropertyId] = useState<
    number | null
  >(null);

  // Dynamic filter options state
  const [developmentStatuses, setDevelopmentStatuses] = useState<string[]>([]);
  const [salesStatuses, setSalesStatuses] = useState<string[]>([]);
  const [statusesLoading, setStatusesLoading] = useState(false);

  // Regions state
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("Dubai");
  const [regionsLoading, setRegionsLoading] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const [filters, setFilters] = useState<Filters>({
    searchTerm: "",
    priceRange: [0, 20000000],
    priceDisplayMode: "total",
    areaRange: [0, 8000],
    completionTimeframe: "all",
    developmentStatus: [],
    unitType: [],
    bedrooms: [],
    salesStatus: [],
  });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [defaultMapView, setDefaultMapView] = useState({
    center: [25.2048, 55.2708] as [number, number],
    zoom: 11,
  });
  // const mapRef = useRef<any>(null);
  const router = useRouter();

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/properties`);
      const data = response.data;

      if (data.success && data.data) {
        const items = data.data.items || data.data || [];
        setProperties(items);
        setFilteredProperties(items);
      } else if (Array.isArray(data)) {
        setProperties(data);
        setFilteredProperties(data);
      } else {
        setProperties([]);
        setFilteredProperties([]);
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
      setFilteredProperties([]);
    } finally {
      setLoading(false);
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

  // Fetch regions from API
  const fetchRegions = async () => {
    setRegionsLoading(true);
    try {
      const response = await axios.get("/api/regions");
      if (response.data && Array.isArray(response.data)) {
        setRegions(response.data);
      } else if (response.data.success && response.data.data) {
        setRegions(response.data.data);
      }
    } catch (error) {
      console.error("❌ Error fetching regions:", error);
      // Fallback to default regions
      setRegions([
        {
          name: "Dubai",
          bbox_ne_lat: 25.3373,
          bbox_ne_lng: 55.5177,
          bbox_sw_lat: 24.7136,
          bbox_sw_lng: 54.8566,
        },
        {
          name: "Abu Dhabi",
          bbox_ne_lat: 25.249089,
          bbox_ne_lng: 56.018126,
          bbox_sw_lat: 22.631514,
          bbox_sw_lng: 51.421236,
        },
      ] as Region[]);
    } finally {
      setRegionsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchStatuses();
    fetchRegions();
  }, []);

  // Handle region change - update map view to selected region
  const handleRegionChange = (regionName: string) => {
    setSelectedRegion(regionName);
    const region = regions.find((r) => r.name === regionName);
    if (region && mapRef.current) {
      // Calculate center from bounding box
      const centerLat = (region.bbox_ne_lat + region.bbox_sw_lat) / 2;
      const centerLng = (region.bbox_ne_lng + region.bbox_sw_lng) / 2;

      // Calculate appropriate zoom level based on bounding box size
      const latDiff = region.bbox_ne_lat - region.bbox_sw_lat;
      const lngDiff = region.bbox_ne_lng - region.bbox_sw_lng;
      const maxDiff = Math.max(latDiff, lngDiff);

      // Estimate zoom level (this is a rough calculation)
      let zoom = 10;
      if (maxDiff < 0.1) zoom = 13;
      else if (maxDiff < 0.5) zoom = 11;
      else if (maxDiff < 1) zoom = 10;
      else if (maxDiff < 2) zoom = 9;
      else zoom = 8;

      const map = mapRef.current;
      map.setView([centerLat, centerLng], zoom, {
        animate: true,
        duration: 1.0,
      });
    }
  };

  const completionTimeframes = [
    { value: "all", label: "All Projects" },
    { value: "within_6m", label: "Within 6 Months" },
    { value: "within_12m", label: "Within 12 Months" },
    { value: "within_24m", label: "Within 24 Months" },
    { value: "beyond_24m", label: "Beyond 24 Months" },
  ];

  // Apply filters
  useEffect(() => {
    let result = [...properties];

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
    result = result.filter((p) => {
      // Use min_price for filtering if available, otherwise skip price filter for this property
      if (p.min_price !== undefined && p.min_price !== null) {
        return (
          p.min_price >= filters.priceRange[0] &&
          (p.max_price || p.min_price) <= filters.priceRange[1]
        );
      }
      // If no price data, include in results (don't filter out)
      return true;
    });

    // Area filtering - skip for now since we don't have area size data in the current interface
    // This can be implemented when area size data is available in the Property interface
    if (filters.areaRange[0] > 0 || filters.areaRange[1] < 8000) {
      // For now, we'll include all properties since we don't have area size data
      // TODO: Add area size field to Property interface when available
    }

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

    // Unit type and bedrooms filtering removed since these fields are not in the current Property interface

    if (filters.salesStatus.length > 0) {
      result = result.filter(
        (p) =>
          filters.salesStatus.includes(p.sale_status) ||
          filters.salesStatus.includes(p.status)
      );
    }

    setFilteredProperties(result);
  }, [properties, filters]);

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
      areaRange: [0, 8000],
      completionTimeframe: "all",
      developmentStatus: [],
      unitType: [],
      bedrooms: [],
      salesStatus: [],
    });
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

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 20000000) count++;
    if (filters.areaRange[0] > 0 || filters.areaRange[1] < 8000) count++;
    if (filters.completionTimeframe !== "all") count++;
    if (filters.developmentStatus.length > 0) count++;
    if (filters.salesStatus.length > 0) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setIsDialogOpen(false);
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

  // useEffect(() => {
  //   delete (L.Icon.Default.prototype as any)._getIconUrl;
  //   L.Icon.Default.mergeOptions({
  //     iconRetinaUrl:
  //       "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  //     iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  //     shadowUrl:
  //       "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  //   });
  // }, []);

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
                value={filters.searchTerm}
                onChange={(e) =>
                  handleFilterChange("searchTerm", e.target.value)
                }
                className="w-full h-12 pl-12 pr-4 border border-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold bg-white text-[#8b7355]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
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
                              handleFilterChange("priceRange", value)
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
                          <Ruler className="w-5 h-5 text-gold" />
                          <span>Area Range</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs text-warm-gray uppercase tracking-wide">
                              Min Sq Ft
                            </Label>
                            <Input
                              type="number"
                              value={filters.areaRange[0]}
                              onChange={(e) =>
                                handleFilterChange("areaRange", [
                                  Number(e.target.value),
                                  filters.areaRange[1],
                                ])
                              }
                              className="border-beige/50 focus:border-gold rounded-lg"
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-warm-gray uppercase tracking-wide">
                              Max Sq Ft
                            </Label>
                            <Input
                              type="number"
                              value={filters.areaRange[1]}
                              onChange={(e) =>
                                handleFilterChange("areaRange", [
                                  filters.areaRange[0],
                                  Number(e.target.value),
                                ])
                              }
                              className="border-beige/50 focus:border-gold rounded-lg"
                              placeholder="5,000"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 p-3 bg-beige/20 rounded-lg">
                          <div className="flex justify-between text-sm text-warm-gray">
                            <span>0 sq ft</span>
                            <span>8,000 sq ft</span>
                          </div>
                          <Slider
                            value={filters.areaRange}
                            onValueChange={(value) =>
                              handleFilterChange("areaRange", value)
                            }
                            max={8000}
                            min={0}
                            step={50}
                            className="w-full"
                          />
                        </div>
                      </CardContent>
                    </Card>

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
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-beige/60 shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center space-x-2 text-[#8b7355] text-lg">
                          <Hammer className="w-5 h-5 text-gold" />
                          <span>Development Status</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {statusesLoading ? (
                          <div className="text-center py-4">
                            <div className="text-warm-gray text-sm">
                              Loading statuses...
                            </div>
                          </div>
                        ) : developmentStatuses.length > 0 ? (
                          developmentStatuses.map((status) => (
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
                        ) : (
                          <div className="text-center py-4">
                            <div className="text-warm-gray text-sm">
                              No development statuses available
                            </div>
                          </div>
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
                          <div className="text-center py-4">
                            <div className="text-warm-gray text-sm">
                              Loading statuses...
                            </div>
                          </div>
                        ) : salesStatuses.length > 0 ? (
                          salesStatuses.map((status) => (
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
                                  handleFilterChange("salesStatus", newStatus);
                                }}
                                className="w-5 h-5 rounded-md border-2 border-[#8b7355]/30 text-gold focus:ring-gold"
                              />
                              <label className="text-sm text-warm-gray cursor-pointer flex-1">
                                {status}
                              </label>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <div className="text-warm-gray text-sm">
                              No sales statuses available
                            </div>
                          </div>
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
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-[#8b7355]">
              {filteredProperties.length} properties found
            </span>
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
                    onClick={() => fetchProperties()}
                    className="bg-gold hover:bg-gold/90 text-charcoal"
                  >
                    Retry
                  </Button>
                </div>
              ) : filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
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
                        <Heart className="w-4 h-4" />
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

                  {filteredProperties
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

                                  {/* <Badge
                                    className={`mt-2 text-xs tracking-wide ${
                                      property.development_status ===
                                      "Completed"
                                        ? "bg-[#8b7355] text-white"
                                        : property.development_status ===
                                          "Under construction"
                                        ? "bg-[#FF6900] text-white"
                                        : property.development_status ===
                                          "Presale"
                                        ? "bg-[#D4AF37] text-white"
                                        : "" // Fallback for unexpected values
                                    }`}
                                  >
                                    {property.development_status ||
                                      property.development_status ||
                                      "Available"}
                                  </Badge> */}
                                </div>

                                {/* <div>
                                  <h4 className="text-sm font-semibold text-[#8b7355]">
                                    {property.name}
                                  </h4>
                                  <p className="text-xs text-warm-gray">
                                    {property.area}
                                  </p>
                                  <p className="text-xs text-deep-blue">
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
                                  </p>
                                  <p className="text-xs text-warm-gray mt-1">
                                    {property.developer}
                                  </p>
                                </div> */}
                              </div>
                            </Popup>
                          )}
                        </Marker>
                      );
                    })}

                  <MapEvents />
                </MapContainer>

                {/* Region selector */}
                <div className="absolute top-4 left-4 bg-white/95 rounded-lg p-3 border border-beige shadow-lg z-[1000] min-w-[200px]">
                  <div className="text-[#8b7355] text-xs font-medium mb-2">
                    Select Region
                  </div>
                  <Select
                    value={selectedRegion}
                    onValueChange={handleRegionChange}
                    disabled={regionsLoading}
                  >
                    <SelectTrigger className="w-full h-8 text-xs border-beige/50 focus:border-gold">
                      <SelectValue
                        placeholder={
                          regionsLoading ? "Loading..." : "Select region"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem
                          key={region.name}
                          value={region.name}
                          className="text-xs"
                        >
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
