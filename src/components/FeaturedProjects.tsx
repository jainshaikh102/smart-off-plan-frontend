import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight, MapPin, TrendingUp, Award, Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Skeleton Loading Component for Featured Properties
const FeaturedPropertySkeleton = () => {
  return (
    <Card className="overflow-hidden bg-white shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] rounded-lg border-0 h-full flex flex-col animate-pulse">
      <div className="relative">
        {/* Image skeleton */}
        <div className="w-full h-56 bg-gray-200"></div>
        {/* Badge skeleton */}
        <div className="absolute top-4 left-4 w-20 h-6 bg-gray-300 rounded"></div>
        {/* Partner badge skeleton */}
        <div className="absolute top-4 right-4 w-16 h-6 bg-gray-300 rounded"></div>
      </div>

      <CardContent className="px-6 pt-4 pb-6 flex flex-col flex-1">
        <div className="flex flex-col flex-1">
          {/* Property Name skeleton */}
          <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>

          {/* Location skeleton */}
          <div className="flex items-center mb-4">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* Price Range skeleton */}
          <div className="mb-4">
            <div className="h-6 bg-gray-200 rounded mb-1 w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>

          {/* Developer & Status skeleton */}
          <div className="space-y-2 mb-6 flex-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-200 rounded mr-1"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-200 rounded mr-1"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>

          {/* CTA Button skeleton */}
          <div className="w-full h-10 bg-gray-200 rounded mt-auto"></div>
        </div>
      </CardContent>
    </Card>
  );
};

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

// Removed hardcoded featuredProjects array - now fetching from database

interface FeaturedProjectsProps {
  onProjectSelect?: (project: any) => void;
  onViewAllProjects?: () => void;
  // Optional props for shared data to avoid multiple API calls
  allProperties?: any[];
  propertiesLoading?: boolean;
  propertiesError?: string | null;
}

export function FeaturedProjects({
  onProjectSelect,
  onViewAllProjects,
  allProperties: sharedAllProperties,
  propertiesLoading,
  propertiesError,
}: FeaturedProjectsProps) {
  const [localProperties, setLocalProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Use shared properties if available, otherwise use local state
  const effectiveAllProperties = sharedAllProperties || localProperties;
  const effectiveLoading =
    propertiesLoading !== undefined ? propertiesLoading : loading;
  const effectiveError =
    propertiesError !== undefined ? propertiesError : error;

  // Filter for featured properties and limit to 3
  const featuredProperties = effectiveAllProperties
    .filter((property: any) => property.featured === true)
    .slice(0, 3);

  // Fetch all properties and filter for featured (fallback when shared props not available)
  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use main properties API instead of dedicated featured endpoint
      const response = await axios.get(`/api/properties`);

      const data = response.data;
      let allProperties: Property[] = [];

      // Handle API response structure
      if (data.success && data.data) {
        allProperties = data.data.items || data.data || [];
      } else if (Array.isArray(data)) {
        allProperties = data;
      }

      // Filter for featured properties and limit to 3
      const featuredProps = allProperties
        .filter((property: Property) => property.featured === true)
        .slice(0, 3);

      setLocalProperties(featuredProps);
    } catch (err) {
      console.error("❌ Error fetching properties for featured section:", err);
      if (axios.isAxiosError(err)) {
        setError(
          `Failed to fetch properties: ${err.response?.status || err.message}`
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to fetch properties"
        );
      }
      setLocalProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch properties if not provided via props
    if (!sharedAllProperties) {
      fetchProperties();
    }
  }, [sharedAllProperties]);

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
    <section id="projects" className="section-padding bg-[#F5F1EB]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="mb-4 text-[rgba(30,26,26,1)] text-[40px]">
            Featured Projects
          </h2>
          <p className="text-[rgba(30,26,26,1)] max-w-2xl mx-auto">
            Discover premium real estate opportunities from Dubai's most trusted
            developers
          </p>
        </div>

        {/* Loading State - Show 3 skeleton cards */}
        {effectiveLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeaturedPropertySkeleton />
            <FeaturedPropertySkeleton />
            <FeaturedPropertySkeleton />
          </div>
        )}

        {/* Error State */}
        {!effectiveLoading && effectiveError && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{effectiveError}</p>
            <Button
              onClick={() => fetchProperties()}
              variant="outline"
              className="border-deep-blue text-deep-blue hover:bg-deep-blue hover:text-white"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Projects Grid - Enhanced detailed cards */}
        {!effectiveLoading && !effectiveError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.length > 0 ? (
              featuredProperties.map((property) => (
                <Card
                  key={property.id}
                  className="overflow-hidden bg-white shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] hover:-translate-y-0.5 transition-all duration-300 rounded-lg border-0 h-full flex flex-col"
                >
                  <div className="relative">
                    <ImageWithFallback
                      src={getImageUrl(property.cover_image_url)}
                      alt={property.name}
                      className="w-full h-56 object-cover"
                    />
                    <Badge
                      className={`absolute top-4 left-4 capitalize bg-[#8b7355] text-white `}
                    >
                      {property.featured || property.featured || "featured"}
                    </Badge>

                    {/* Partner Project Badge */}
                    {property.is_partner_project && (
                      <Badge className="absolute top-4 right-4 bg-gold text-[rgba(255,255,255,1)]">
                        <Award className="w-3 h-3 mr-1" />
                        Partner
                      </Badge>
                    )}
                  </div>

                  <CardContent className="px-6 pt-4 pb-6 flex flex-col flex-1">
                    <div className="flex flex-col flex-1">
                      {/* Property Name */}
                      <h4
                        className="text-lg font-medium mb-2 text-deep-blue truncate"
                        title={property.name}
                      >
                        {property.name}
                      </h4>

                      {/* Location */}
                      <div className="flex items-center text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm truncate text-[rgba(0,0,0,1)]">
                          {property.area}
                        </span>
                      </div>

                      {/* Price Range */}
                      <div className="mb-4">
                        <div className="text-xl font-medium text-[#8b7355] mb-1">
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
                        <div className="text-sm text-[rgba(0,0,0,1)]">
                          {property.is_partner_project
                            ? "Partner Project"
                            : "Available"}
                        </div>
                      </div>

                      {/* Developer & Status */}
                      <div className="space-y-2 mb-6 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Award className="w-3 h-3 mr-1" />
                            Developer
                          </span>
                          <span
                            className="text-sm truncate ml-2 text-[rgba(0,0,0,1)]"
                            title={property.developer}
                          >
                            {property.developer}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Status
                          </span>
                          <span className="text-sm text-[rgba(0,0,0,1)]">
                            {property.sale_status || "Available"}
                          </span>
                        </div>
                      </div>

                      {/* CTA Button - Always at bottom */}
                      <Button
                        className="w-full bg-[#8b7355] hover:bg-[#8b7355]/90 mt-auto text-white"
                        onClick={() =>
                          router.push(`/properties/${property.id}`)
                        }
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // No featured properties found
              <div className="col-span-full text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No featured properties available</p>
                  <p className="text-sm">
                    Featured properties will appear here once they are marked by
                    administrators.
                  </p>
                </div>
                <Button
                  onClick={() => fetchProperties()}
                  variant="outline"
                  className="border-deep-blue text-deep-blue hover:bg-deep-blue hover:text-white"
                >
                  Refresh
                </Button>
              </div>
            )}
          </div>
        )}

        {/* View All Featured Button */}
        {!effectiveLoading &&
          !effectiveError &&
          featuredProperties.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="bg-[#FEFDFB] hover:bg-[#8b7355]/90 mt-auto text-[#8b7355] hover:text-white"
                onClick={() => router.push(`/properties`)}
              >
                View All Featured Projects
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
      </div>
    </section>
  );
}
