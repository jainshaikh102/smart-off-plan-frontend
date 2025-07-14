import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
  Car,
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
  CheckCircle,
  Clock,
  AlertCircle,
  ShoppingCart,
  Banknote,
  Check,
  Hammer,
  Home as HomeIcon,
  Users,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PropertyFiltersTestingProps {
  onPropertySelect: (property: any) => void;
  allProperties: any[];
  propertiesLoading: boolean;
  propertiesError: string | null;
}

interface FilterState {
  priceUnit: "total" | "sqft";
  minArea: number;
  maxArea: number;
  developmentStatus: string[];
  unitTypes: string[];
  bedrooms: string[];
  salesStatus: string[];
  completionDate: string;
  minPrice: number;
  maxPrice: number;
}

export function PropertyFiltersTesting({ 
  onPropertySelect, 
  allProperties, 
  propertiesLoading, 
  propertiesError 
}: PropertyFiltersTestingProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mapView, setMapView] = useState(true);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<number | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Advanced filter state
  const [filters, setFilters] = useState<FilterState>({
    priceUnit: "total",
    minArea: 0,
    maxArea: 5000,
    developmentStatus: [],
    unitTypes: [],
    bedrooms: [],
    salesStatus: [],
    completionDate: "all",
    minPrice: 0,
    maxPrice: 10000000,
  });

  // Filter options
  const developmentStatusOptions = [
    { value: "off-plan", label: "Off-Plan" },
    { value: "under-construction", label: "Under Construction" },
    { value: "ready", label: "Ready" },
    { value: "completed", label: "Completed" },
  ];

  const unitTypeOptions = [
    { value: "apartment", label: "Apartment" },
    { value: "villa", label: "Villa" },
    { value: "townhouse", label: "Townhouse" },
    { value: "penthouse", label: "Penthouse" },
    { value: "office", label: "Office" },
  ];

  const bedroomOptions = [
    { value: "studio", label: "Studio" },
    { value: "1", label: "1 Bedroom" },
    { value: "2", label: "2 Bedrooms" },
    { value: "3", label: "3 Bedrooms" },
    { value: "4", label: "4 Bedrooms" },
    { value: "5+", label: "5+ Bedrooms" },
  ];

  const salesStatusOptions = [
    { value: "available", label: "Available" },
    { value: "sold-out", label: "Sold Out" },
    { value: "limited", label: "Limited Units" },
  ];

  // Helper functions for filters
  const toggleArrayFilter = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter((item) => item !== value)
      : [...array, value];
  };

  const updateFilters = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      priceUnit: "total",
      minArea: 0,
      maxArea: 5000,
      developmentStatus: [],
      unitTypes: [],
      bedrooms: [],
      salesStatus: [],
      completionDate: "all",
      minPrice: 0,
      maxPrice: 10000000,
    });
    setSearchTerm("");
  };

  const hasActiveFilters = () => {
    return (
      filters.priceUnit !== "total" ||
      filters.minArea !== 0 ||
      filters.maxArea !== 5000 ||
      filters.developmentStatus.length > 0 ||
      filters.unitTypes.length > 0 ||
      filters.bedrooms.length > 0 ||
      filters.salesStatus.length > 0 ||
      filters.completionDate !== "all" ||
      filters.minPrice !== 0 ||
      filters.maxPrice !== 10000000
    );
  };

  const handlePropertyHover = (propertyId: number | null) => {
    setHoveredPropertyId(propertyId);
  };

  // Filter properties based on current filters and search term
  const filteredProperties = allProperties.filter((property) => {
    const matchesSearch =
      !searchTerm ||
      property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.developer?.toLowerCase().includes(searchTerm.toLowerCase());

    // Add more filtering logic here based on your property data structure
    return matchesSearch;
  });

  const handlePropertyClick = (property: any) => {
    onPropertySelect(property);
  };

  if (propertiesLoading) {
    return (
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading properties...</p>
          </div>
        </div>
      </section>
    );
  }

  if (propertiesError) {
    return (
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">Error loading properties</div>
            <p className="text-gray-600">{propertiesError}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-white">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-[#8b7355] mb-6">Find Your Perfect Property</h2>
          <p className="text-warm-gray max-w-2xl mx-auto text-lg">
            Explore our curated selection of luxury properties in Dubai's most
            prestigious locations. Use our advanced search and interactive map
            to find your ideal investment.
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by property name, location, or developer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-beige focus:border-gold"
            />
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className={`border-beige hover:border-gold ${
                    hasActiveFilters() ? "bg-gold/10 border-gold" : ""
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters() && (
                    <Badge className="ml-2 bg-gold text-charcoal">
                      {Object.values(filters).filter(v => 
                        Array.isArray(v) ? v.length > 0 : 
                        typeof v === 'string' ? v !== 'total' && v !== 'all' :
                        typeof v === 'number' ? v !== 0 && v !== 5000 && v !== 10000000 : false
                      ).length}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-[#8b7355]">Advanced Filters</DialogTitle>
                  <DialogDescription>
                    Refine your search with detailed criteria
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Filter content would go here */}
                  <div className="text-center py-8 text-gray-500">
                    Advanced filters coming soon...
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="border-beige hover:border-gold"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset All
                  </Button>
                  <Button
                    onClick={() => setIsFilterModalOpen(false)}
                    className="bg-gold hover:bg-gold/90 text-charcoal"
                  >
                    Apply Filters
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={() => setMapView(!mapView)}
              className="border-beige hover:border-gold"
            >
              {mapView ? <Building className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Properties List */}
          <div className="lg:col-span-1">
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredProperties.length > 0 ? (
                filteredProperties.slice(0, 10).map((property) => (
                  <div
                    key={property.id || property.externalId}
                    className={`border rounded-lg p-3 transition-all duration-300 cursor-pointer ${
                      hoveredPropertyId === (property.id || property.externalId)
                        ? "border-gold/70 shadow-lg bg-gold/5 scale-[1.02]"
                        : "border-border hover:border-gold/50 hover:shadow-md"
                    }`}
                    onClick={() => handlePropertyClick(property)}
                    onMouseEnter={() => handlePropertyHover(property.id || property.externalId)}
                    onMouseLeave={() => handlePropertyHover(null)}
                  >
                    <div className="flex gap-3">
                      <ImageWithFallback
                        src={property.cover_image_url || "/placeholder-property.jpg"}
                        alt={property.name}
                        className="w-16 h-16 rounded-lg object-cover"
                        width={64}
                        height={64}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-charcoal truncate">
                          {property.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {property.area}
                        </p>
                        <p className="text-xs text-gold font-medium">
                          {property.price_currency} {property.min_price?.toLocaleString()}
                          {property.max_price && property.max_price !== property.min_price && 
                            ` - ${property.max_price.toLocaleString()}`
                          }
                        </p>
                        <Badge
                          className={`mt-1 text-xs ${
                            property.sale_status === "Available"
                              ? "bg-emerald-green"
                              : property.sale_status === "Sold Out"
                              ? "bg-red-500"
                              : "bg-orange-500"
                          }`}
                        >
                          {property.sale_status}
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
            </div>
          </div>

          {/* Map/Grid View */}
          <div className="lg:col-span-2">
            {mapView ? (
              <Card className="border-beige h-[600px]">
                <CardContent className="p-0 h-full relative">
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <p className="text-blue-600 font-medium">Interactive Map</p>
                      <p className="text-blue-500 text-sm">Coming Soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.slice(0, 6).map((property) => (
                  <Card
                    key={property.id || property.externalId}
                    className="border-beige hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 group overflow-hidden rounded-xl"
                    onClick={() => handlePropertyClick(property)}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <ImageWithFallback
                        src={property.cover_image_url || "/placeholder-property.jpg"}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        width={400}
                        height={300}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-charcoal mb-2 group-hover:text-gold transition-colors">
                        {property.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        {property.area}
                      </p>
                      <p className="text-gold font-bold text-lg">
                        {property.price_currency} {property.min_price?.toLocaleString()}
                        {property.max_price && property.max_price !== property.min_price && 
                          ` - ${property.max_price.toLocaleString()}`
                        }
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <Badge
                          className={`text-xs ${
                            property.sale_status === "Available"
                              ? "bg-emerald-green"
                              : property.sale_status === "Sold Out"
                              ? "bg-red-500"
                              : "bg-orange-500"
                          }`}
                        >
                          {property.sale_status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-gold p-1"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
