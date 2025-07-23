import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  SlidersHorizontal,
  RotateCcw,
  Banknote,
  Home,
  Clock,
  Hammer,
  ShoppingCart,
  Search,
} from "lucide-react";

// Shared interfaces for filters
export interface Filters {
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

export interface PropertyFiltersDialogProps {
  appliedFilters: Filters;
  searchTerm: string; // Current search term for display
  onFiltersChange: (filters: Filters) => void;
  onSearchChange: (searchTerm: string) => void;
  getActiveFilterCount: () => number;
  resetFilters: () => void;
  children?: React.ReactNode; // For the trigger button
}

export function PropertyFiltersDialog({
  appliedFilters,
  searchTerm,
  onFiltersChange,
  onSearchChange,
  getActiveFilterCount,
  resetFilters,
  children,
}: PropertyFiltersDialogProps) {
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogFilters, setDialogFilters] = useState<Filters>(appliedFilters);

  // Dynamic filter options state
  const [developmentStatuses, setDevelopmentStatuses] = useState<string[]>([]);
  const [unitType, setUnitType] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState<string[]>([]);
  const [salesStatuses, setSalesStatuses] = useState<string[]>([]);
  const [statusesLoading, setStatusesLoading] = useState(false);

  // Completion timeframes
  const completionTimeframes = [
    { value: "all", label: "All Projects" },
    { value: "within_6m", label: "Within 6 Months" },
    { value: "within_12m", label: "Within 12 Months" },
    { value: "within_24m", label: "Within 24 Months" },
    { value: "beyond_24m", label: "Beyond 24 Months" },
  ];

  // Filter helper functions for dialog filters (temporary state)
  const handleDialogFilterChange = (
    key: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    setDialogFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    // Apply the dialog filters to the applied filters (this will trigger the API call)
    const newFilters = { ...dialogFilters };
    onFiltersChange(newFilters);
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

  // Load statuses when component mounts
  useEffect(() => {
    console.log("🚀 PropertyFiltersDialog: Initial load - fetching statuses");
    fetchStatuses();
  }, []);

  return (
    <>
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray w-5 h-5" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white border-beige focus:border-gold rounded-xl"
          />
        </div>
      </div>

      {/* Filters Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
        <DialogTrigger asChild>
          {children || (
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
          )}
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
                <p className="text-xs text-warm-gray mt-2">
                  Enter positive values only. Minimum cannot exceed maximum.
                </p>
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
                          min="0"
                          value={
                            dialogFilters.priceRange[0] === 0
                              ? ""
                              : dialogFilters.priceRange[0]
                          }
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            // Only allow positive values or 0
                            if (value >= 0 || e.target.value === "") {
                              const newMinValue = value || 0;
                              // Ensure min is not greater than max
                              const finalMaxValue = Math.max(
                                newMinValue,
                                dialogFilters.priceRange[1]
                              );
                              handleDialogFilterChange("priceRange", [
                                newMinValue,
                                finalMaxValue,
                              ]);
                            }
                          }}
                          onFocus={(e) => {
                            if (dialogFilters.priceRange[0] === 0) {
                              e.target.select();
                            }
                          }}
                          onKeyDown={(e) => {
                            // Prevent minus key, plus key, and 'e' key
                            if (
                              e.key === "-" ||
                              e.key === "+" ||
                              e.key === "e" ||
                              e.key === "E"
                            ) {
                              e.preventDefault();
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
                          min="0"
                          value={
                            dialogFilters.priceRange[1] === 20000000
                              ? ""
                              : dialogFilters.priceRange[1]
                          }
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            // Only allow positive values or 0, with minimum being the current min value
                            if (value >= 0 || e.target.value === "") {
                              const newMaxValue = value || 20000000;
                              // Ensure max is not less than min
                              const finalMaxValue = Math.max(
                                newMaxValue,
                                dialogFilters.priceRange[0]
                              );
                              handleDialogFilterChange("priceRange", [
                                dialogFilters.priceRange[0],
                                finalMaxValue,
                              ]);
                            }
                          }}
                          onFocus={(e) => {
                            if (dialogFilters.priceRange[1] === 20000000) {
                              e.target.select();
                            }
                          }}
                          onKeyDown={(e) => {
                            // Prevent minus key, plus key, and 'e' key
                            if (
                              e.key === "-" ||
                              e.key === "+" ||
                              e.key === "e" ||
                              e.key === "E"
                            ) {
                              e.preventDefault();
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
                  <p className="text-xs text-warm-gray mt-2">
                    Enter positive values only. Minimum cannot exceed maximum.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
                            min="0"
                            value={
                              dialogFilters.areaRange[0] === 0
                                ? ""
                                : dialogFilters.areaRange[0]
                            }
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              // Only allow positive values or 0
                              if (value >= 0 || e.target.value === "") {
                                const newMinValue = value || 0;
                                // Ensure min is not greater than max
                                const finalMaxValue = Math.max(
                                  newMinValue,
                                  dialogFilters.areaRange[1]
                                );
                                handleDialogFilterChange("areaRange", [
                                  newMinValue,
                                  finalMaxValue,
                                ]);
                              }
                            }}
                            onFocus={(e) => {
                              if (dialogFilters.areaRange[0] === 0) {
                                e.target.select();
                              }
                            }}
                            onKeyDown={(e) => {
                              // Prevent minus key, plus key, and 'e' key
                              if (
                                e.key === "-" ||
                                e.key === "+" ||
                                e.key === "e" ||
                                e.key === "E"
                              ) {
                                e.preventDefault();
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
                            min="0"
                            value={
                              dialogFilters.areaRange[1] === 50000
                                ? ""
                                : dialogFilters.areaRange[1]
                            }
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              // Only allow positive values or 0, with minimum being the current min value
                              if (value >= 0 || e.target.value === "") {
                                const newMaxValue = value || 50000;
                                // Ensure max is not less than min
                                const finalMaxValue = Math.max(
                                  newMaxValue,
                                  dialogFilters.areaRange[0]
                                );
                                handleDialogFilterChange("areaRange", [
                                  dialogFilters.areaRange[0],
                                  finalMaxValue,
                                ]);
                              }
                            }}
                            onFocus={(e) => {
                              if (dialogFilters.areaRange[1] === 50000) {
                                e.target.select();
                              }
                            }}
                            onKeyDown={(e) => {
                              // Prevent minus key, plus key, and 'e' key
                              if (
                                e.key === "-" ||
                                e.key === "+" ||
                                e.key === "e" ||
                                e.key === "E"
                              ) {
                                e.preventDefault();
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
                        handleDialogFilterChange("completionTimeframe", value)
                      }
                    >
                      <SelectTrigger className="border-beige/50 focus:border-gold rounded-lg">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        {completionTimeframes.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
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
                      <div key={status} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={dialogFilters.developmentStatus.includes(
                            status
                          )}
                          onChange={(e) => {
                            const newStatus = e.target.checked
                              ? [...dialogFilters.developmentStatus, status]
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
                      <div key={status} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={dialogFilters.salesStatus.includes(status)}
                          onChange={(e) => {
                            const newStatus = e.target.checked
                              ? [...dialogFilters.salesStatus, status]
                              : dialogFilters.salesStatus.filter(
                                  (s: string) => s !== status
                                );
                            handleDialogFilterChange("salesStatus", newStatus);
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
                      <div key={type} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={dialogFilters.unitType.includes(type)}
                          onChange={(e) => {
                            const newUnitType = e.target.checked
                              ? [...dialogFilters.unitType, type]
                              : dialogFilters.unitType.filter(
                                  (t: string) => t !== type
                                );
                            handleDialogFilterChange("unitType", newUnitType); // Update unitType
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
                      <div key={type} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={dialogFilters.bedrooms.includes(type)}
                          onChange={(e) => {
                            const newBedrooms = e.target.checked
                              ? [...dialogFilters.bedrooms, type]
                              : dialogFilters.bedrooms.filter(
                                  (t: string) => t !== type
                                );
                            handleDialogFilterChange("bedrooms", newBedrooms);
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
    </>
  );
}
