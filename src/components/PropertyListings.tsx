import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Download,
  MapPin,
  Grid3X3,
  List,
  Bath,
  Bed,
  Square,
  Heart,
  TrendingUp,
  Clock,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useRouter } from "next/navigation";

interface Project {
  id: number;
  name: string;
  area: string; // Database uses 'area' instead of 'location'
  developer: string;
  min_price?: number;
  max_price?: number;
  price_currency: string;
  cover_image_url?: string;
  sale_status: string;
  status: string;
  completion_datetime?: string;
  is_partner_project: boolean;
  featured: boolean;
  reelly_status: boolean;
  // Optional fields that might not exist in all properties
  bedrooms?: string;
  bathrooms?: string;
  size?: string;
  roi?: string;
  coordinates?: [number, number];
  description?: string;
}

interface PropertyListingsProps {
  onProjectSelect: (project: Project) => void;
  onLoadMore: () => void;
  // Optional props for shared data to avoid multiple API calls
  allProperties?: any[];
  propertiesLoading?: boolean;
  propertiesError?: string | null;
}

export function PropertyListings({
  onProjectSelect,
  onLoadMore,
  allProperties,
  propertiesLoading,
  propertiesError,
}: PropertyListingsProps) {
  const [sortBy, setSortBy] = useState("completion");
  const [properties, setProperties] = useState<Project[]>([]);
  const [localAllProperties, setLocalAllProperties] = useState<Project[]>([]); // Store original data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Use shared properties if available, otherwise use local state
  const effectiveAllProperties = allProperties || localAllProperties;
  const effectiveLoading =
    propertiesLoading !== undefined ? propertiesLoading : loading;
  const effectiveError =
    propertiesError !== undefined ? propertiesError : error;

  // Filter properties to only show those with completion dates within 12 months
  const filterPropertiesWithin12Months = (properties: Project[]) => {
    const now = new Date();
    const twelveMonthsFromNow = new Date(now);
    twelveMonthsFromNow.setFullYear(now.getFullYear() + 1);

    return properties.filter((property) => {
      if (!property.completion_datetime) return false;

      const completionDate = new Date(property.completion_datetime);

      return completionDate >= now && completionDate <= twelveMonthsFromNow;
    });
  };

  // Fetch properties with completion dates within 12 months (backend filtering)
  const fetchPropertiesForCompletion = async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate 12 months from now for backend filtering
      const now = new Date();
      const twelveMonthsFromNow = new Date(now);
      twelveMonthsFromNow.setFullYear(now.getFullYear() + 1);

      // Use backend filtering instead of frontend filtering
      const response = await axios.get("/api/properties", {
        params: {
          completion_datetime: twelveMonthsFromNow.toISOString(),
          limit: 100, // Get more properties since we're filtering on backend
          page: 1,
        },
      });
      const data = response.data;

      let allPropertiesData: Project[] = [];

      if (data.success && data.data) {
        // Handle different response structures
        allPropertiesData = data.data.items || data.data || [];
      } else if (Array.isArray(data)) {
        allPropertiesData = data;
      }

      // No need for frontend filtering since backend already filtered
      setLocalAllProperties(allPropertiesData);
      // Initial sorting will be applied by useEffect
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
      setLocalAllProperties([]);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Sort properties based on selected criteria
  const sortProperties = (
    propertiesToSort: Project[],
    sortCriteria: string
  ) => {
    const sorted = [...propertiesToSort];

    switch (sortCriteria) {
      case "completion":
        return sorted.sort((a, b) => {
          const dateA = a.completion_datetime
            ? new Date(a.completion_datetime).getTime()
            : Infinity;
          const dateB = b.completion_datetime
            ? new Date(b.completion_datetime).getTime()
            : Infinity;
          return dateA - dateB; // Earliest first
        });

      case "price-low":
        return sorted.sort((a, b) => {
          const priceA = a.min_price || 0;
          const priceB = b.min_price || 0;
          return priceA - priceB; // Low to high
        });

      case "price-high":
        return sorted.sort((a, b) => {
          const priceA = a.max_price || a.min_price || 0;
          const priceB = b.max_price || b.min_price || 0;
          return priceB - priceA; // High to low
        });

      case "newest":
        return sorted.sort((a, b) => {
          // Sort by ID descending (assuming higher ID = newer)
          return b.id - a.id;
        });

      case "roi":
        // For now, sort by featured status and then by price
        return sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          const priceA = a.min_price || 0;
          const priceB = b.min_price || 0;
          return priceA - priceB;
        });

      default:
        return sorted;
    }
  };

  // Apply sorting when sortBy changes or when shared properties are provided
  useEffect(() => {
    if (effectiveAllProperties.length > 0) {
      // No need for frontend filtering since backend handles completion date filtering
      // When using shared properties, we still need to filter for 12-month completion
      const filteredProperties = allProperties
        ? filterPropertiesWithin12Months(effectiveAllProperties)
        : effectiveAllProperties; // Backend already filtered, no need to filter again

      const sortedProperties = sortProperties(filteredProperties, sortBy);
      setProperties(sortedProperties);
    }
  }, [sortBy, effectiveAllProperties, allProperties]);

  // Fetch properties on component mount only if shared properties are not provided
  useEffect(() => {
    if (!allProperties) {
      fetchPropertiesForCompletion();
    }
  }, [allProperties]);

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

  const PropertyCard = ({ property }: { property: Project }) => {
    return (
      <Card
        className="bg-white shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group cursor-pointer rounded-xl border-0 h-full"
        onClick={() => router.push(`/properties/${property?.id}`)}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <ImageWithFallback
            src={getImageUrl(property.cover_image_url)}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-gold text-[#8b7355] px-2 py-1 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {property.completion_datetime
                ? new Date(property.completion_datetime).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                    }
                  )
                : "TBD"}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Button
              size="sm"
              variant="ghost"
              className="bg-white/90 hover:bg-white text-[#8b7355] p-1.5 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                // Handle favorite logic
              }}
            >
              <Heart className="w-3 h-3" />
            </Button>
          </div>
          <div className="absolute bottom-3 left-3">
            <Badge
              variant="outline"
              className="bg-white/90 border-white text-[#8b7355] text-xs"
            >
              {property.sale_status || property.status || "Available"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <div className="mb-3">
            <h3 className="text-lg text-[rgba(30,26,26,1)] mb-1 group-hover:text-gold transition-colors line-clamp-1">
              {property.name}
            </h3>
            <div className="flex items-center text-warm-gray text-sm mb-2">
              <MapPin className="w-3 h-3 mr-1" />
              {property.area}
            </div>
            <div className="text-lg text-[#8b7355]">
              {property.min_price && property.max_price
                ? `${property.price_currency} ${(
                    property.min_price / 1000000
                  ).toFixed(1)}M - ${(property.max_price / 1000000).toFixed(
                    1
                  )}M`
                : property.min_price
                ? `${property.price_currency} ${(
                    property.min_price / 1000000
                  ).toFixed(1)}M+`
                : "Price on Request"}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3 text-center">
            <div>
              <div className="flex items-center justify-center mb-1">
                <Bed className="w-3 h-3 text-gold mr-1" />
                <span className="text-xs text-warm-gray">Beds</span>
              </div>
              <div className="text-[#8b7355] text-sm">{property.bedrooms}</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <Bath className="w-3 h-3 text-gold mr-1" />
                <span className="text-xs text-warm-gray">Baths</span>
              </div>
              <div className="text-[#8b7355] text-sm">{property.bathrooms}</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
                <span className="text-xs text-warm-gray">ROI</span>
              </div>
              <div className="text-emerald-500 text-sm">{property.roi}</div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-[rgba(30,26,26,0.6)] mb-2">
              By {property.developer}
            </div>

            <Button
              className="bg-gold hover:bg-gold/90 text-[rgba(255,255,255,1)] px-4 py-1 text-sm w-full"
              // onClick={(e) => {
              //   e.stopPropagation();
              //   onProjectSelect(property);
              // }}
              onClick={() => router.push(`/properties/${property?.id}`)}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="section-padding bg-[rgba(255,255,255,1)]">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
          <div className="mb-6 lg:mb-0">
            <h2 className="mb-4 text-[rgba(30,26,26,1)] text-[36px]">
              Nearly Ready Properties
            </h2>
            <p className="text-[rgba(30,26,26,1)] text-xl max-w-2xl leading-relaxed">
              Move in soon with these exceptional properties completing within
              12 months. Secure your investment with immediate handover
              opportunities.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-52 rounded-xl bg-white border-soft-gray/30 text-[#8b7355]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completion">Earliest Completion</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="roi">Best ROI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8">
          <div className="bg-white rounded-xl p-4 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              {effectiveLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span className="text-[rgba(30,26,26,0.5)]">
                    Loading properties...
                  </span>
                </div>
              ) : effectiveError ? (
                <p className="text-red-500 mb-2 sm:mb-0">{effectiveError}</p>
              ) : (
                <>
                  <p className="text-[rgba(30,26,26,0.5)] mb-2 sm:mb-0">
                    Showing{" "}
                    <span className="text-[rgba(30,26,26,0.5)]">
                      {properties.length} nearly ready properties
                    </span>{" "}
                    • Completion within 12 months
                  </p>
                  <div className="text-sm text-warm-gray flex items-center">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    Sorted by:{" "}
                    <span className="text-gold ml-1">
                      {sortBy === "completion" && "Earliest Completion"}
                      {sortBy === "price-low" && "Price: Low to High"}
                      {sortBy === "price-high" && "Price: High to Low"}
                      {sortBy === "newest" && "Newest First"}
                      {sortBy === "roi" && "Best ROI"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Properties Horizontal Scroll */}
        {effectiveLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : effectiveError ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              onClick={fetchPropertiesForCompletion}
              variant="outline"
              className="border-deep-blue text-deep-blue hover:bg-deep-blue hover:text-white"
            >
              Try Again
            </Button>
          </div>
        ) : properties.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="flex gap-8 pb-4" style={{ width: "max-content" }}>
              {properties.map((property) => (
                <div key={property.id} className="flex-shrink-0 w-80">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarDays className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No Properties Found
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              No properties completing within the next 12 months are currently
              available.
            </p>
            <Button
              onClick={fetchPropertiesForCompletion}
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-white"
            >
              Refresh
            </Button>
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-16">
          <Button
            variant="outline"
            size="lg"
            className="border-[#8b7355] text-[#8b7355] hover:bg-[#8b7355] hover:text-white px-8 py-3 rounded-xl transition-all duration-300"
            // onClick={onLoadMore}
            onClick={() => router.push(`/properties/`)}
          >
            View All
          </Button>
        </div>

        {/* Quick Handover Benefits */}
        <div className="mt-16 bg-[rgba(255,255,255,1)] rounded-2xl p-8 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]">
          <div className="text-center mb-8">
            <h3 className="text-[rgba(30,26,26,1)] mb-4">
              Benefits of Nearly Ready Properties
            </h3>
            <p className="text-[rgba(30,26,26,1)] text-lg">
              Why choosing properties with immediate handover makes smart
              investment sense
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-3xl text-gold mb-2 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                3-12
              </div>
              <div className="text-[rgba(30,26,26,0.7)]">
                Months to Handover
              </div>
            </div>
            <div className="text-center group">
              <div className="text-3xl text-gold mb-2 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                85%
              </div>
              <div className="text-[rgba(30,26,26,0.7)]">Payment Completed</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl text-gold mb-2 group-hover:scale-110 transition-transform duration-300">
                <CalendarDays className="w-8 h-8 mx-auto mb-2" />
                95%
              </div>
              <div className="text-[rgba(30,26,26,0.7)]">
                Construction Complete
              </div>
            </div>
            <div className="text-center group">
              <div className="text-3xl text-gold mb-2 group-hover:scale-110 transition-transform duration-300">
                <Download className="w-8 h-8 mx-auto mb-2" />
                100%
              </div>
              <div className="text-[rgba(30,26,26,0.7)]">Ready for Rental</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
