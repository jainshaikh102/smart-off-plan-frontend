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

interface PropertyFiltersProps {
  onPropertySelect: (property: any) => void;
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

export function PropertyFilters({ onPropertySelect }: PropertyFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mapView, setMapView] = useState(true);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<number | null>(
    null
  );
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

  // Dynamic filter options state
  const [developmentStatusOptions, setDevelopmentStatusOptions] = useState<
    string[]
  >(["Presale", "Under Construction", "Completed"]);
  const [unitTypeOptions, setUnitTypeOptions] = useState<string[]>([]);
  const [bedroomOptions, setBedroomOptions] = useState<string[]>([]);
  const [salesStatusOptions, setSalesStatusOptions] = useState<string[]>([
    "Announced",
    "Presale (EOI)",
    "Start of Sales",
    "On Sale",
    "Out of Stock",
  ]);
  const completionDateOptions = [
    { value: "all", label: "All Projects" },
    { value: "12months", label: "Completing in 12 months" },
    { value: "2years", label: "Completing in 2 years" },
    { value: "3years", label: "Completing in 3 years" },
    { value: "4years", label: "Completing in 4 years" },
    { value: "5years", label: "Completing in 5+ years" },
  ];

  // Fetch unit types and bedroom options from API
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Use consolidated unit types (8 main categories only)
        setUnitTypeOptions([
          "Apartments",
          "Villa",
          "Townhouse",
          "Duplex",
          "Penthouse",
          "Loft",
          "Mansion",
          "Other",
        ]);

        // Use consolidated bedroom options (6 main categories only)
        setBedroomOptions([
          "Studio",
          "Suite",
          "1 BR",
          "2 BR",
          "3 BR",
          "4 BR",
          "5+ BR",
        ]);
      } catch (error) {
        // Use consolidated fallback values on error (8 main categories only)
        setUnitTypeOptions([
          "Apartments",
          "Villa",
          "Townhouse",
          "Duplex",
          "Penthouse",
          "Loft",
          "Mansion",
          "Other",
        ]);
        setBedroomOptions([
          "Studio",
          "Suite",
          "1 BR",
          "2 BR",
          "3 BR",
          "4 BR",
          "5+ BR",
        ]);
      }
    };

    fetchFilterOptions();
  }, []);

  // Mock properties data with real Dubai coordinates
  const properties = [
    {
      id: 1,
      name: "Marina Vista Towers",
      location: "Dubai Marina",
      price: "AED 1,200,000",
      image:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      beds: 2,
      baths: 2,
      sqft: 1100,
      type: "Apartment",
      status: "Off-plan",
      coordinates: {
        lat: 25.0771,
        lng: 55.1408,
        x: 15, // Position on the map container
        y: 65,
      },
    },
    {
      id: 2,
      name: "Downtown Heights",
      location: "Downtown Dubai",
      price: "AED 2,200,000",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      beds: 3,
      baths: 3,
      sqft: 1500,
      type: "Apartment",
      status: "Ready",
      coordinates: {
        lat: 25.1972,
        lng: 55.2744,
        x: 50,
        y: 45,
      },
    },
    {
      id: 3,
      name: "Business Bay Tower",
      location: "Business Bay",
      price: "AED 950,000",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      beds: 1,
      baths: 1,
      sqft: 700,
      type: "Studio",
      status: "Off-plan",
      coordinates: {
        lat: 25.1881,
        lng: 55.2604,
        x: 45,
        y: 50,
      },
    },
    {
      id: 4,
      name: "Palm Luxury Villa",
      location: "Palm Jumeirah",
      price: "AED 8,500,000",
      image:
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      beds: 5,
      baths: 6,
      sqft: 4500,
      type: "Villa",
      status: "Ready",
      coordinates: {
        lat: 25.1124,
        lng: 55.139,
        x: 25,
        y: 75,
      },
    },
    {
      id: 5,
      name: "JBR Beachfront",
      location: "Jumeirah Beach Residence",
      price: "AED 1,800,000",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      beds: 2,
      baths: 2,
      sqft: 1250,
      type: "Apartment",
      status: "Under Construction",
      coordinates: {
        lat: 25.0869,
        lng: 55.1442,
        x: 20,
        y: 60,
      },
    },
    {
      id: 6,
      name: "DIFC Premium Office",
      location: "Dubai International Financial Centre",
      price: "AED 3,200,000",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      beds: 0,
      baths: 2,
      sqft: 2000,
      type: "Office",
      status: "Ready",
      coordinates: {
        lat: 25.2138,
        lng: 55.2806,
        x: 55,
        y: 40,
      },
    },
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

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceUnit !== "total") count++;
    if (filters.minArea !== 0 || filters.maxArea !== 5000) count++;
    if (filters.developmentStatus.length > 0) count++;
    if (filters.unitTypes.length > 0) count++;
    if (filters.bedrooms.length > 0) count++;
    if (filters.salesStatus.length > 0) count++;
    if (filters.completionDate !== "all") count++;
    if (filters.minPrice !== 0 || filters.maxPrice !== 10000000) count++;
    return count;
  };

  const filteredProperties = properties.filter((property) => {
    const price = parseInt(property.price.replace(/[^0-9]/g, ""));
    const matchesPrice = price >= filters.minPrice && price <= filters.maxPrice;
    const matchesType =
      filters.unitTypes.length === 0 ||
      filters.unitTypes.includes(property.type);
    const matchesBeds =
      filters.bedrooms.length === 0 ||
      filters.bedrooms.includes(property.beds.toString());
    const matchesSearch =
      !searchTerm ||
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesPrice && matchesType && matchesBeds && matchesSearch;
  });

  const handlePropertyClick = (property: any) => {
    onPropertySelect(property);
  };

  const handlePropertyHover = (propertyId: number | null) => {
    setHoveredPropertyId(propertyId);
  };

  const formatPrice = (value: number) => {
    if (filters.priceUnit === "sqft") {
      return `${value.toLocaleString()}`;
    } else {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
      }
      return value.toLocaleString();
    }
  };

  const LuxuryCheckboxGroup = ({
    options,
    values,
    onChange,
    label,
    icon: Icon,
  }: {
    options: string[];
    values: string[];
    onChange: (values: string[]) => void;
    label: string;
    icon: any;
  }) => (
    <Card className="border-beige/60 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-[#8b7355] text-lg">
          <Icon className="w-5 h-5 text-gold" />
          <span>{label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-3 group">
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                values.includes(option)
                  ? "bg-gold border-gold text-charcoal shadow-sm"
                  : "border-[#8b7355]/30 hover:border-gold hover:bg-gold/5 hover:shadow-sm"
              }`}
              onClick={() => onChange(toggleArrayFilter(values, option))}
            >
              {values.includes(option) && <Check className="w-3 h-3" />}
            </div>
            <label
              className="text-sm text-warm-gray cursor-pointer flex-1 group-hover:text-[#8b7355] transition-colors"
              onClick={() => onChange(toggleArrayFilter(values, option))}
            >
              {option}
            </label>
          </div>
        ))}
      </CardContent>
    </Card>
  );

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

        {/* Search and Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-8 lg:items-center">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-warm-gray w-5 h-5" />
              <input
                type="text"
                placeholder="Search by property name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-12 pr-4 border border-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold bg-white text-[#8b7355]"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Main Filter Modal */}
            <Dialog
              open={isFilterModalOpen}
              onOpenChange={setIsFilterModalOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-[#8b7355]/30 text-[#8b7355] hover:bg-[#8b7355] hover:text-white rounded-xl relative ${
                    hasActiveFilters()
                      ? "bg-gold text-charcoal border-gold"
                      : ""
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {getActiveFiltersCount() > 0 && (
                    <Badge className="ml-2 bg-[#8b7355] text-white text-xs min-w-[20px] h-5">
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-6xl max-h-[90vh] bg-white flex flex-col overflow-hidden">
                {/* Fixed Header - No Scroll */}
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
                        onClick={resetFilters}
                        disabled={!hasActiveFilters()}
                        className={`border-[#8b7355]/30 transition-all duration-200 ${
                          hasActiveFilters()
                            ? "text-gold border-gold/30 hover:bg-gold/10 hover:border-gold"
                            : "text-warm-gray border-beige hover:bg-beige/50"
                        }`}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                      <Button
                        onClick={() => setIsFilterModalOpen(false)}
                        className="bg-gold hover:bg-gold/90 text-charcoal"
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </DialogHeader>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto py-8 space-y-8">
                  {/* Price Configuration Section */}
                  {/* <Card className="border-gold/40 bg-beige"> */}
                  <Card className="border-gold/40 bg-[#FDFCF9]">
                    {/* <Card className="border-gold/40 bg-gradient-to-r from-light-gold/30 to-beige/90"> */}
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-[#8b7355] text-xl">
                        <Banknote className="w-6 h-6 text-gold" />
                        <span>Price Configuration</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Price Unit Toggle */}
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
                          <Label
                            className={`text-sm transition-colors ${
                              filters.priceUnit === "total"
                                ? "text-[#8b7355]"
                                : "text-warm-gray"
                            }`}
                          >
                            Total Price
                          </Label>
                          <Switch
                            checked={filters.priceUnit === "sqft"}
                            onCheckedChange={(checked) =>
                              updateFilters(
                                "priceUnit",
                                checked ? "sqft" : "total"
                              )
                            }
                            // className="data-[state=checked]:bg-gold"
                          />
                          <Label
                            className={`text-sm transition-colors 
                              ${
                                filters.priceUnit === "sqft"
                                  ? "text-[#8b7355]"
                                  : "text-warm-gray"
                              }
                                `}
                          >
                            Per Sq Ft
                          </Label>
                        </div>
                      </div>

                      {/* Price Range */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5 text-gold" />
                          <Label className="text-[#8b7355] font-medium text-lg">
                            Price Range (
                            {filters.priceUnit === "sqft"
                              ? "AED per Sq Ft"
                              : "AED"}
                            )
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
                                value={filters.minPrice}
                                onChange={(e) =>
                                  updateFilters(
                                    "minPrice",
                                    parseInt(e.target.value) || 0
                                  )
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
                                value={filters.maxPrice}
                                onChange={(e) =>
                                  updateFilters(
                                    "maxPrice",
                                    parseInt(e.target.value) || 10000000
                                  )
                                }
                                className="pl-12 border-beige/50 focus:border-gold rounded-lg"
                                placeholder="10,000,000"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 p-4 bg-beige/30 rounded-lg">
                          <div className="flex justify-between text-sm text-warm-gray">
                            <span>AED {formatPrice(filters.minPrice)}</span>
                            <span>AED {formatPrice(filters.maxPrice)}</span>
                          </div>
                          <Slider
                            value={[filters.minPrice, filters.maxPrice]}
                            onValueChange={([min, max]) => {
                              updateFilters("minPrice", min);
                              updateFilters("maxPrice", max);
                            }}
                            max={filters.priceUnit === "sqft" ? 5000 : 20000000}
                            min={0}
                            step={filters.priceUnit === "sqft" ? 50 : 50000}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Area and Timing Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Area Range */}
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
                              value={filters.minArea}
                              onChange={(e) =>
                                updateFilters(
                                  "minArea",
                                  parseInt(e.target.value) || 0
                                )
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
                              value={filters.maxArea}
                              onChange={(e) =>
                                updateFilters(
                                  "maxArea",
                                  parseInt(e.target.value) || 5000
                                )
                              }
                              className="border-beige/50 focus:border-gold rounded-lg"
                              placeholder="5,000"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 p-3 bg-beige/20 rounded-lg">
                          <div className="flex justify-between text-sm text-warm-gray">
                            <span>
                              {filters.minArea.toLocaleString()} sq ft
                            </span>
                            <span>
                              {filters.maxArea.toLocaleString()} sq ft
                            </span>
                          </div>
                          <Slider
                            value={[filters.minArea, filters.maxArea]}
                            onValueChange={([min, max]) => {
                              updateFilters("minArea", min);
                              updateFilters("maxArea", max);
                            }}
                            max={8000}
                            min={0}
                            step={50}
                            className="w-full"
                          />
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
                            value={filters.completionDate}
                            onValueChange={(value) =>
                              updateFilters("completionDate", value)
                            }
                          >
                            <SelectTrigger className="border-beige/50 focus:border-gold rounded-lg">
                              <SelectValue placeholder="Select timeframe" />
                            </SelectTrigger>
                            <SelectContent>
                              {completionDateOptions.map((option) => (
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

                  {/* Property Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Development Status */}
                    <LuxuryCheckboxGroup
                      options={developmentStatusOptions}
                      values={filters.developmentStatus}
                      onChange={(values) =>
                        updateFilters("developmentStatus", values)
                      }
                      label="Development Status"
                      icon={Hammer}
                    />

                    {/* Unit Type */}
                    <LuxuryCheckboxGroup
                      options={unitTypeOptions}
                      values={filters.unitTypes}
                      onChange={(values) => updateFilters("unitTypes", values)}
                      label="Unit Type"
                      icon={HomeIcon}
                    />

                    {/* Bedrooms */}
                    <LuxuryCheckboxGroup
                      options={bedroomOptions}
                      values={filters.bedrooms}
                      onChange={(values) => updateFilters("bedrooms", values)}
                      label="Bedrooms"
                      icon={Bed}
                    />

                    {/* Sales Status */}
                    <LuxuryCheckboxGroup
                      options={salesStatusOptions}
                      values={filters.salesStatus}
                      onChange={(values) =>
                        updateFilters("salesStatus", values)
                      }
                      label="Sales Status"
                      icon={ShoppingCart}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              onClick={resetFilters}
              className="text-warm-gray hover:text-gold rounded-xl"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Toggle View */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-[#8b7355]">
              {filteredProperties.length} properties found
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-warm-gray text-sm">View:</span>
            <Button
              variant={mapView ? "default" : "outline"}
              size="sm"
              onClick={() => setMapView(true)}
              className={
                mapView
                  ? "bg-[#8b7355] text-white"
                  : "border-[#8b7355]/30 text-[#8b7355] hover:bg-[#8b7355] hover:text-white"
              }
            >
              <Layers className="w-4 h-4 mr-2" />
              Map
            </Button>
            <Button
              variant={!mapView ? "default" : "outline"}
              size="sm"
              onClick={() => setMapView(false)}
              className={
                !mapView
                  ? "bg-[#8b7355] text-white"
                  : "border-[#8b7355]/30 text-[#8b7355] hover:bg-[#8b7355] hover:text-white"
              }
            >
              <Filter className="w-4 h-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Properties List */}
          <div className="lg:col-span-1">
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <div
                    key={property.id}
                    className={`border rounded-lg p-3 transition-all duration-300 cursor-pointer ${
                      hoveredPropertyId === property.id
                        ? "border-gold/70 shadow-lg bg-gold/5 scale-[1.02]"
                        : "border-border hover:border-gold/50 hover:shadow-md"
                    }`}
                    onClick={() => handlePropertyClick(property)}
                    onMouseEnter={() => handlePropertyHover(property.id)}
                    onMouseLeave={() => handlePropertyHover(null)}
                  >
                    <div className="flex gap-3">
                      <ImageWithFallback
                        src={property.image}
                        alt={property.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`mb-1 truncate text-sm transition-colors duration-300 ${
                            hoveredPropertyId === property.id
                              ? "text-gold"
                              : "text-[rgba(30,26,26,1)]"
                          }`}
                        >
                          {property.name}
                        </h4>
                        <div className="flex items-center text-muted-foreground text-xs mb-1">
                          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{property.location}</span>
                        </div>
                        <div className="text-deep-blue mb-2 text-sm">
                          {property.price}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Bed className="w-3 h-3 mr-1" />
                            {property.beds}
                          </div>
                          <div className="flex items-center">
                            <Bath className="w-3 h-3 mr-1" />
                            {property.baths}
                          </div>
                          <div className="flex items-center">
                            <Square className="w-3 h-3 mr-1" />
                            {property.sqft}
                          </div>
                        </div>
                        <Badge
                          className={`mt-2 text-xs ${
                            property.status === "Ready"
                              ? "bg-emerald-green"
                              : property.status === "Off-plan"
                              ? "bg-deep-blue"
                              : "bg-orange-500"
                          }`}
                        >
                          {property.status}
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

          {/* Interactive Google Map */}
          <div className="lg:col-span-2">
            {mapView ? (
              <Card className="h-[600px] border-beige shadow-sm overflow-hidden">
                <CardContent className="p-0 h-full relative">
                  {/* Google Maps Iframe */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462563.0073568769!2d54.94739765!3d25.076472500000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sus!4v1635789654123!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  />

                  {/* Map Controls Overlay */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/90 border-beige hover:bg-white shadow-lg"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/90 border-beige hover:bg-white shadow-lg"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/90 border-beige hover:bg-white shadow-lg"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Property Markers Overlay */}
                  {filteredProperties.map((property) => {
                    const isHovered = hoveredPropertyId === property.id;
                    return (
                      <div
                        key={property.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                        style={{
                          left: `${property.coordinates.x}%`,
                          top: `${property.coordinates.y}%`,
                        }}
                        onClick={() => handlePropertyClick(property)}
                        onMouseEnter={() => handlePropertyHover(property.id)}
                        onMouseLeave={() => handlePropertyHover(null)}
                      >
                        {/* Enhanced Marker with Highlight States */}
                        <div className="relative">
                          <div
                            className={`transition-all duration-300 border-3 border-white rounded-full shadow-lg flex items-center justify-center ${
                              isHovered
                                ? "w-12 h-12 bg-gold scale-110 shadow-2xl shadow-gold/50"
                                : "w-8 h-8 bg-gold group-hover:scale-110"
                            }`}
                          >
                            <div
                              className={`bg-white rounded-full transition-all duration-300 ${
                                isHovered ? "w-4 h-4" : "w-3 h-3"
                              }`}
                            ></div>

                            {/* Pulse ring for hovered state */}
                            {isHovered && (
                              <div className="absolute inset-0 rounded-full bg-gold animate-ping opacity-30"></div>
                            )}

                            {/* Glow effect for hovered state */}
                            {isHovered && (
                              <div className="absolute inset-0 rounded-full bg-gold/20 scale-150 animate-pulse"></div>
                            )}
                          </div>

                          {/* Property Info Popup - Enhanced for hovered state */}
                          <div
                            className={`absolute bottom-14 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-beige p-3 min-w-[220px] transition-all duration-300 pointer-events-none z-30 ${
                              isHovered
                                ? "opacity-100 scale-105 shadow-2xl border-gold/30"
                                : "opacity-0 group-hover:opacity-100 scale-100"
                            }`}
                          >
                            <div className="flex gap-3">
                              <ImageWithFallback
                                src={property.image}
                                alt={property.name}
                                className="w-14 h-14 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h5
                                  className={`text-sm mb-1 font-medium transition-colors duration-300 ${
                                    isHovered ? "text-gold" : "text-[#8b7355]"
                                  }`}
                                >
                                  {property.name}
                                </h5>
                                <div className="flex items-center text-warm-gray text-xs mb-1">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {property.location}
                                </div>
                                <div
                                  className={`text-sm font-medium transition-colors duration-300 ${
                                    isHovered ? "text-gold" : "text-gold"
                                  }`}
                                >
                                  {property.price}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-warm-gray mt-1">
                                  <span className="flex items-center">
                                    <Bed className="w-3 h-3 mr-1" />
                                    {property.beds}
                                  </span>
                                  <span className="flex items-center">
                                    <Bath className="w-3 h-3 mr-1" />
                                    {property.baths}
                                  </span>
                                  <span className="flex items-center">
                                    <Square className="w-3 h-3 mr-1" />
                                    {property.sqft}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {/* Popup Arrow */}
                            <div
                              className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent transition-colors duration-300 ${
                                isHovered ? "border-t-white" : "border-t-white"
                              }`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Dubai Areas Legend */}

                  {/* Location Coordinates Display */}
                  <div className="absolute top-4 left-4 bg-white/95 rounded-lg p-2 border border-beige shadow-lg z-10">
                    <div className="text-[#8b7355] text-xs font-medium">
                      Dubai, UAE
                    </div>
                    <div className="text-warm-gray text-xs">
                      25.2048° N, 55.2708° E
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <Card
                    key={property.id}
                    className="border-beige hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 group overflow-hidden rounded-xl"
                    onClick={() => handlePropertyClick(property)}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <ImageWithFallback
                        src={property.image}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-[#8b7355] group-hover:text-gold transition-colors">
                            {property.name}
                          </h4>
                          <div className="flex items-center text-warm-gray text-sm mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {property.location}
                          </div>
                        </div>

                        <div className="text-2xl text-gold">
                          {property.price}
                        </div>

                        <div className="flex items-center justify-between text-sm text-warm-gray">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Bed className="w-4 h-4 mr-1" />
                              {property.beds} Bed
                              {property.beds !== 1 ? "s" : ""}
                            </div>
                            <div className="flex items-center">
                              <Bath className="w-4 h-4 mr-1" />
                              {property.baths} Bath
                              {property.baths !== 1 ? "s" : ""}
                            </div>
                            <div className="flex items-center">
                              <Square className="w-4 h-4 mr-1" />
                              {property.sqft} sq ft
                            </div>
                          </div>
                          <Badge
                            className={`text-xs ${
                              property.status === "Ready"
                                ? "bg-emerald-green"
                                : property.status === "Off-plan"
                                ? "bg-deep-blue"
                                : "bg-orange-500"
                            }`}
                          >
                            {property.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-beige/50 to-light-gold/30 rounded-2xl p-8">
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
